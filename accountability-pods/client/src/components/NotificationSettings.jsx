import { useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import api from "../lib/axios";

const NotificationSettings = () => {
  const [permission, setPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported",
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setError("This browser does not support notifications");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        await subscribeToPush();
      }
    } catch (err) {
      setError("Failed to request permission");
      console.error("Notification permission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPush = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered");

      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error("VAPID public key not configured");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      await api.post("/notifications/subscribe", { subscription });
      setIsSubscribed(true);
      console.log("Push subscription successful");
    } catch (err) {
      setError("Failed to subscribe to push notifications");
      console.error("Push subscription error:", err);
    }
  };

  if (!("Notification" in window)) {
    return null;
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSubscribed || permission === "granted" ? (
            <Bell size={20} className="text-secondary" />
          ) : (
            <BellOff size={20} className="text-on-surface-variant" />
          )}
          <div>
            <h4 className="text-body-md font-medium text-primary">
              Push Notifications
            </h4>
            <p className="text-label-caps text-on-surface-variant">
              {isSubscribed
                ? "Reminders enabled"
                : permission === "granted"
                ? "Enable reminders"
                : "Enable notifications"}
            </p>
          </div>
        </div>

        {isSubscribed ? (
          <div className="flex items-center gap-2 text-teal-600">
            <Check size={18} />
            <span className="text-body-sm font-medium">Active</span>
          </div>
        ) : permission === "granted" ? (
          <button
            onClick={subscribeToPush}
            disabled={loading}
            className="rounded-lg bg-secondary px-4 py-2 text-body-sm font-medium text-on-secondary hover:bg-secondary-container disabled:opacity-50 transition-colors"
          >
            {loading ? "Enabling..." : "Enable Reminders"}
          </button>
        ) : (
          <button
            onClick={requestPermission}
            disabled={loading}
            className="rounded-lg bg-secondary px-4 py-2 text-body-sm font-medium text-on-secondary hover:bg-secondary-container disabled:opacity-50 transition-colors"
          >
            {loading ? "Requesting..." : "Enable Notifications"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-body-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default NotificationSettings;
