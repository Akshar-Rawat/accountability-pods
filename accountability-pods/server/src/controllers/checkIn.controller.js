import CheckIn from "../models/checkIn.model.js";
import Pod from "../models/pods.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getTodayInTimezone } from "../utils/dateUtils.js";

const createCheckIn = asyncHandler(async (req, res) => {
  const { podId } = req.params;

  const { note, photoUrl } = req.body;

  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  const isMember = pod.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }

  const today = getTodayInTimezone(req.user.timezone);

  const existingCheckIn = await CheckIn.findOne({
    pod: podId,
    user: userId,
    date: today,
  });
  if (existingCheckIn) {
    throw new ApiError(409, "You have already checked in today");
  }
  const checkIn = await CheckIn.create({
    pod: podId,
    user: userId,
    date: today,
    note,
    photoUrl,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, checkIn, "Check-in created successfully"));
});
const getTodaysCheckIns = asyncHandler(async (req, res) => {
  const { podId } = req.params;
  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  const isMember = pod.members.some((member) =>
    member.equals(userId)
  );

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }

  const today = getTodayInTimezone(req.user.timezone);

  const checkIns = await CheckIn.find({
    pod: podId,
    date: today,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        checkIns,
        "Today's check-ins retrieved successfully"
      )
    );
});

const getCheckInHistory = asyncHandler(async (req, res) => {
  const { podId } = req.params;
  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  const isMember = pod.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }


  const checkIns = await CheckIn.find({
    pod: podId,
    user: userId,
  }).sort({ date: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        checkIns,
        "Check-in history retrieved successfully"
      )
    );
});



export {createCheckIn, getTodaysCheckIns, getCheckInHistory}