import { nanoid } from "nanoid";
import Pod from "../models/pods.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPod = asyncHandler(async (req, res) => {
  const { name, goal, frequency, customDays } = req.body;
  const adminId = req.user._id;
  const inviteCode = nanoid(8);

  if (!name || !goal || !frequency) {
    throw new ApiError(400, "Name, goal and frequency are required");
  }
  if (frequency === "weekly" && (!customDays || customDays.length === 0)) {
    throw new ApiError(400, "Custom days are required for weekly frequency");
  }
  const pod = await Pod.create({
    name,
    goal,
    frequency,
    customDays,
    members: [adminId],
    admin: adminId,
    inviteCode,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, pod, "Pod created successfully"));
});

const getMyPods = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const pods = await Pod.find({ members: userId });
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
  const populatedPod = await pod.populate("members", "username email avatar");
  return res
    .status(200)
    .json(new ApiResponse(200, populatedPod, "Pod retrieved successfully"));
});

const joinPod = asyncHandler(async (req, res) => {
  const inviteCode = req.params.inviteCode;
  const userId = req.user._id;
  const pod = await Pod.findOne({ inviteCode });
  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }
  if (pod.members.some((member) => member.equals(userId))) {
    throw new ApiError(400, "User is already a member of this pod");
  }
  if (pod.members.length >= pod.maxMembers) {
    throw new ApiError(400, "Pod is full");
  }
  pod.members.push(userId);
  await pod.save();
  return res
    .status(200)
    .json(new ApiResponse(200, pod, "Joined pod successfully"));
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
      await Pod.findByIdAndDelete(podId);
      await CheckIn.deleteMany({ pod: podId });
      await Streak.deleteMany({ pod: podId });
      return res.status(200).json(new ApiResponse(200, {}, "Pod deleted successfully as you were the last member"));
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

  if (frequency === "weekly" && (!customDays || customDays.length === 0)) {
    throw new ApiError(400, "Custom days are required for weekly frequency");
  }

  if (name !== undefined) pod.name = name;

  if (goal !== undefined) pod.goal = goal;

  if (frequency !== undefined) {
    pod.frequency = frequency;
  }

  if (customDays !== undefined) {
    pod.customDays = customDays;
  }

  if (maxMembers !== undefined) {
    if (maxMembers < pod.members.length) {
      throw new ApiError(
        400,
        "Max members cannot be less than current members",
      );
    }

    pod.maxMembers = maxMembers;
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
  const members = await Pod.findById(podId).populate("members", "username email avatar");

  return res.status(200).json(new ApiResponse(200, members.members, "Pod members retrieved successfully"));
});

export { createPod, getMyPods, getPodById, joinPod, leavePod, updatePod, getPodMembers  }; 
