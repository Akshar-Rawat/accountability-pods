import GlobalMessage from "../models/globalMessage.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getGlobalMessages = asyncHandler(async (_req, res) => {
  const messages = await GlobalMessage.find().sort({ createdAt: -1 }).limit(100).populate("user", "username avatar");
  res.status(200).json(new ApiResponse(200, messages.reverse(), "Global messages retrieved successfully"));
});
