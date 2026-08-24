import Pod from "../models/pods.model.js";
import Streak from "../models/streak.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const getStreak = asyncHandler(async (req, res) => {
  const { podId } = req.params;
  const userId = req.user._id;
const pod= await Pod.findById(podId);
  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }
  const isMember = pod.members.some((member) => member.equals(userId));
  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }
  const streak = await Streak.findOne({ pod: podId, user: userId });

  if (!streak) {
    throw new ApiError(404, "Streak not found");
  }

  return res.status(200).json(new ApiResponse(200, streak, "Streak retrieved successfully"));
});

export { getStreak };