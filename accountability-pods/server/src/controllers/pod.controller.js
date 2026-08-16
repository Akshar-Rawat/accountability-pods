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
  if (frequency === "custom" && (!customDays || customDays.length === 0)) {
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
    .json(new ApiResponse(201,pod, "Pod created successfully"));
});


export  {
  createPod,
};