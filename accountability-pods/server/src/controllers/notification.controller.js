import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const subscribeToNotifications = asyncHandler(async (req, res) => {
  const { subscription } = req.body;
  const userId = req.user._id;

  if (!subscription) {
    throw new ApiError(400, "Subscription object is required");
  }

  await User.findByIdAndUpdate(userId, {
    pushSubscription: subscription,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully subscribed to notifications"));
});

export { subscribeToNotifications };
