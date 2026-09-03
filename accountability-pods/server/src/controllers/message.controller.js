import Message from "../models/message.model.js";
import Pod from "../models/pods.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getPodMessages = asyncHandler(async (req, res) => {
  const { podId } = req.params;
  const { before } = req.query;
  const userId = req.user._id;

  const pod = await Pod.findById(podId);

  if (!pod) {
    throw new ApiError(404, "Pod not found");
  }

  const isMember = pod.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new ApiError(403, "You are not a member of this pod");
  }

  const query = { pod: podId };

  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const messages = await Message.find(query)
    .populate("user", "username avatar")
    .sort({ createdAt: -1 })
    .limit(30);

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages.reverse(), "Messages retrieved successfully"),
    );
});

export { getPodMessages };
