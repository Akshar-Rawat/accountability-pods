import cron from "node-cron";
import { DateTime } from "luxon";
import { User } from "../models/user.model.js";
import Pod from "../models/pods.model.js";
import CheckIn from "../models/checkIn.model.js";
import { getTodayInTimezone } from "../utils/dateUtils.js";
import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:your-email@example.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

const isCheckInRequiredToday = (frequency, customDays, timezone) => {
  const today = DateTime.now().setZone(timezone);
  const dayOfWeek = today.weekday;

  if (frequency === "daily") {
    return true;
  }

  if (frequency === "weekdays") {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  if (frequency === "custom" && customDays && customDays.length > 0) {
    return customDays.includes(dayOfWeek);
  }

  return false;
};

const sendPushNotification = async (subscription, title, body) => {
  try {
    if (!subscription) return;

    const payload = JSON.stringify({ title, body });

    await webpush.sendNotification(subscription, payload);
    console.log(`Push notification sent to user`);
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
};

const sendReminderNudges = async () => {
  console.log("Running reminder nudge job...");

  try {
    const users = await User.find({ pushSubscription: { $ne: null } });

    for (const user of users) {
      const userTimezone = user.timezone || "UTC";
      const userTime = DateTime.now().setZone(userTimezone);
      const userHour = userTime.hour;

      const reminderHour = 20;

      if (userHour !== reminderHour) {
        continue;
      }

      const pods = await Pod.find({ members: user._id }).populate("members");

      for (const pod of pods) {
        if (!isCheckInRequiredToday(pod.frequency, pod.customDays, userTimezone)) {
          continue;
        }

        const today = getTodayInTimezone(userTimezone);

        const existingCheckIn = await CheckIn.findOne({
          pod: pod._id,
          user: user._id,
          date: today,
        });

        if (existingCheckIn) {
          continue;
        }

        await sendPushNotification(
          user.pushSubscription,
          "Your pod is waiting on you",
          "Keep your streak alive. Check in today!"
        );
      }
    }
  } catch (error) {
    console.error("Error in reminder nudge job:", error);
  }
};

const sendPodWaitingNudge = async (podId, checkingInUserId) => {
  try {
    const pod = await Pod.findById(podId).populate("members");
    if (!pod) return;

    const today = getTodayInTimezone("UTC");

    const allCheckedIn = await Promise.all(
      pod.members.map(async (member) => {
        const checkIn = await CheckIn.findOne({
          pod: podId,
          user: member._id,
          date: today,
        });
        return !!checkIn;
      })
    );

    const checkingInUserIndex = pod.members.findIndex(
      (m) => m._id.toString() === checkingInUserId.toString()
    );

    const isLastToCheckIn = allCheckedIn.filter(Boolean).length === pod.members.length - 1;

    if (!isLastToCheckIn) return;

    for (const member of pod.members) {
      if (member._id.toString() === checkingInUserId.toString()) continue;

      const hasCheckedIn = await CheckIn.findOne({
        pod: podId,
        user: member._id,
        date: today,
      });

      if (hasCheckedIn) continue;

      const user = await User.findById(member._id);
      if (user && user.pushSubscription) {
        await sendPushNotification(
          user.pushSubscription,
          "Your pod is waiting on you 👀",
          "Everyone else has checked in. Don't break the streak!"
        );
      }
    }
  } catch (error) {
    console.error("Error in pod waiting nudge:", error);
  }
};

export const startNudgeCron = () => {
  cron.schedule("0 * * * *", () => {
    sendReminderNudges();
  });

  console.log("Nudge cron job started (runs every hour)");
};

export { sendReminderNudges, sendPodWaitingNudge };
