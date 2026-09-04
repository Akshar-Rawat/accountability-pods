import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { sendPushNotification } from "../services/nudgeCron.js";

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

const sendTestNotification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("pushSubscription");
  const subscription = req.body?.subscription || user?.pushSubscription;
  if (!subscription) throw new ApiError(400, "Enable notifications first");
  if (req.body?.subscription) {
    await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
  }
  try {
    await sendPushNotification(subscription, "Pods test notification", "Push notifications are working.");
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404 || error.statusCode === 410) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { pushSubscription: 1 } });
      throw new ApiError(400, "Your browser subscription expired. Enable notifications again.");
    }
    throw new ApiError(503, error.message || "Push service is unavailable");
  }
  return res.status(200).json(new ApiResponse(200, null, "Test notification sent"));
});

export { subscribeToNotifications, sendTestNotification };
