import CheckIn from "../models/checkIn.model.js";
import Pod from "../models/pods.model.js";
import Streak from "../models/streak.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getTodayInTimezone } from "../utils/dateUtils.js";
import { calculateStreak } from "../services/streak.service.js";
import { getSocketIO } from "../utils/socket.js";
import Message from "../models/message.model.js";
import fs from "node:fs";
import { sendPodWaitingNudge } from "../services/nudgeCron.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  let checkIn;
  try {
    checkIn = await CheckIn.create({
      pod: podId,
      user: userId,
      date: today,
      note,
      photoUrl,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "You have already checked in today");
    }
    throw error;
  }

  let streak = await Streak.findOne({ pod: podId, user: userId });

  const { currentStreak, longestStreak, lastCheckInDate } =
  calculateStreak({
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
    lastCheckInDate: streak?.lastCheckInDate || null,
    today,
    frequency: pod.frequency,
    customDays: pod.customDays,
  });

await Streak.findOneAndUpdate(
  {
    pod: podId,
    user: userId,
  },
  {
    $set: {
      currentStreak,
      longestStreak,
      lastCheckInDate,
    },
  },
  {
   returnDocument: "after",
    upsert: true,
  }
);

  const io = getSocketIO();
  const messageText = photoUrl
    ? `🔥 ${req.user.username} checked in today with proof`
    : `🔥 ${req.user.username} checked in today`;
  const noteText = typeof note === "string" ? note.trim() : "";
  const chatText = noteText ? `${messageText}\n“${noteText}”` : messageText;
  const systemMessage = await Message.create({
    pod: podId,
    user: userId,
    text: chatText,
    type: "system",
    photoUrl: photoUrl || null,
  });
  const populatedSystemMessage = await Message.findById(systemMessage._id).populate(
    "user",
    "username avatar"
  );

  if (io) {
    const roomName = `pod:${podId}`;

    io.to(roomName).emit("member_checked_in", {
      userId,
      username: req.user.username,
      streak: { currentStreak, longestStreak, lastCheckInDate },
      systemMessage: populatedSystemMessage,
    });
  }

  sendPodWaitingNudge(podId, userId);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        checkIn,
        streak: {
          currentStreak,
          longestStreak,
          lastCheckInDate,
        },
      },
      "Check-in created successfully",
    ),
  );
});
const getTodaysCheckIns = asyncHandler(async (req, res) => {
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

  const today = getTodayInTimezone(req.user.timezone);

  const checkIns = await CheckIn.find({
    pod: podId,
    date: today,
  }).populate("user","username avatar");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        checkIns,
        "Today's check-ins retrieved successfully",
      ),
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
      new ApiResponse(200, checkIns, "Check-in history retrieved successfully"),
    );
});



const uploadImage = asyncHandler(async (req, res) => {
  const cleanupInvalidUpload = () => {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  };

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    cleanupInvalidUpload();
    throw new ApiError(503, "Photo uploads are not configured on this server");
  }

  if (!req.file) {
    throw new ApiError(400, "An image file is required");
  }

  if (!req.file.mimetype.startsWith("image/")) {
    cleanupInvalidUpload();
    throw new ApiError(400, "Only image uploads are allowed");
  }

  try {
    const result = await uploadOnCloudinary(req.file.path);

    if (!result) {
      throw new ApiError(500, "Failed to upload image");
    }

    return res.status(200).json(
      new ApiResponse(200, { url: result.secure_url }, "Image uploaded successfully")
    );
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
});

export { createCheckIn, getTodaysCheckIns, getCheckInHistory, uploadImage };
