import { nanoid } from "nanoid";

import Pod from "../models/pods.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import CheckIn from "../models/checkIn.model.js";
import Streak from "../models/streak.model.js";

const validateCustomDays = (frequency, customDays) => {
  if (frequency !== "custom") {
    return [];
  }

  if (!Array.isArray(customDays) || customDays.length === 0) {
    throw new ApiError(400, "Custom days are required for custom frequency");
  }

  const validDays = customDays.every(
    (day) => Number.isInteger(day) && day >= 1 && day <= 7,
  );

  if (!validDays) {
    throw new ApiError(400, "Custom days must contain values from 1 to 7");
  }

  return [...new Set(customDays)];
};

const createPod = asyncHandler(async (req, res) => {
  const { name, goal, frequency, customDays, maxMembers = 5 } = req.body;

  const adminId = req.user._id;

  if (!name || !goal || !frequency) {
    throw new ApiError(400, "Name, goal and frequency are required");
  }

  const allowedFrequencies = ["daily", "weekdays", "monthly", "custom"];

  if (!allowedFrequencies.includes(frequency)) {
    throw new ApiError(400, "Invalid frequency");
  }

  if (!Number.isInteger(Number(maxMembers)) || Number(maxMembers) < 2 || Number(maxMembers) > 100) {
    throw new ApiError(400, "Max members must be a whole number between 2 and 100");
  }

  const normalizedCustomDays = validateCustomDays(frequency, customDays);

  const inviteCode = nanoid(8);

  const pod = await Pod.create({
    name,
    goal,
    frequency,
    customDays: normalizedCustomDays,
    members: [adminId],
    admin: adminId,
    inviteCode,
    maxMembers: Number(maxMembers),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, pod, "Pod created successfully"));
});

const getMyPods = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const pods = await Pod.find({
    members: userId,
  }).populate("members", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, pods, "Pods retrieved successfully"));
});

const getPodById = asyncHandler(async (req, res) => {
  const podId = req.params.id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  if (!pod.members.some((member) => member.equals(req.user._id))) {
    throw new ApiError(403, "You are not a member of this pod");
  }

  const populatedPod = await pod.populate("members", "username email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, populatedPod, "Pod retrieved successfully"));
});

const joinPod = asyncHandler(async (req, res) => {
  const inviteCode = req.params.inviteCode;
  const userId = req.user._id;

  const pod = await Pod.findOne({
    inviteCode,
  });

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  if (pod.members.some((member) => member.equals(userId))) {
    throw new ApiError(400, "User is already a member of this pod");
  }

  const updatedPod = await Pod.findOneAndUpdate(
    {
      _id: pod._id,
      members: { $ne: userId },
      $expr: { $lt: [{ $size: "$members" }, "$maxMembers"] },
    },
    { $addToSet: { members: userId } },
    { returnDocument: "after" },
  );

  if (!updatedPod) {
    throw new ApiError(400, pod.members.length >= pod.maxMembers ? "Pod is full" : "User is already a member of this pod");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPod, "Joined pod successfully"));
});

const leavePod = asyncHandler(async (req, res) => {
  const podId = req.params.id;
  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  if (!pod.members.some((member) => member.equals(userId))) {
    throw new ApiError(400, "User is not a member of this pod");
  }

  if (pod.admin.equals(userId)) {
    const newAdmin = pod.members.find((member) => !member.equals(userId));

    if (!newAdmin) {
      await CheckIn.deleteMany({
        pod: podId,
      });

      await Streak.deleteMany({
        pod: podId,
      });

      await Pod.findByIdAndDelete(podId);

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "Pod deleted successfully as you were the last member",
          ),
        );
    }

    pod.admin = newAdmin;
  }

  pod.members = pod.members.filter((member) => !member.equals(userId));

  await pod.save();

  return res
    .status(200)
    .json(new ApiResponse(200, pod, "Left pod successfully"));
});

const updatePod = asyncHandler(async (req, res) => {
  const podId = req.params.id;
  const userId = req.user._id;

  const { name, goal, frequency, customDays, maxMembers } = req.body;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  if (!pod.admin.equals(userId)) {
    throw new ApiError(403, "User is not the admin of this pod");
  }

  if (frequency !== undefined) {
    const allowedFrequencies = ["daily", "weekdays", "monthly", "custom"];

    if (!allowedFrequencies.includes(frequency)) {
      throw new ApiError(400, "Invalid frequency");
    }

    if (frequency === "custom") {
      validateCustomDays(frequency, customDays);
    }

    pod.frequency = frequency;

    if (frequency !== "custom") {
      pod.customDays = [];
    }
  }

  if (name !== undefined) {
    pod.name = name;
  }

  if (goal !== undefined) {
    pod.goal = goal;
  }

  if (frequency === "custom" && customDays !== undefined) {
    pod.customDays = [...new Set(customDays)];
  }

  if (maxMembers !== undefined) {
    if (!Number.isInteger(Number(maxMembers)) || Number(maxMembers) < 2 || Number(maxMembers) > 100) {
      throw new ApiError(400, "Max members must be a whole number between 2 and 100");
    }
    if (Number(maxMembers) < pod.members.length) {
      throw new ApiError(
        400,
        "Max members cannot be less than current members",
      );
    }

    pod.maxMembers = Number(maxMembers);
  }

  await pod.save();

  return res
    .status(200)
    .json(new ApiResponse(200, pod, "Pod updated successfully"));
});

const getPodMembers = asyncHandler(async (req, res) => {
  const podId = req.params.id;
  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  const isMember = pod.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }

  await pod.populate("members", "username email avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(200, pod.members, "Pod members retrieved successfully"),
    );
});

export {
  createPod,
  getMyPods,
  getPodById,
  joinPod,
  leavePod,
  updatePod,
  getPodMembers,
};
