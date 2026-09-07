import { useEffect, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import api from "../lib/axios";

const NotificationSettings = () => {
  const [permission, setPermission] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported",
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!("serviceWorker" in navigator)) return;
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      setIsSubscribed(Boolean(subscription));
    };

    loadSubscription().catch(() => setError("Unable to read notification settings"));
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const bytes = Uint8Array.from(rawData, (character) => character.charCodeAt(0));
    if (bytes.length !== 65 || bytes[0] !== 4) {
      throw new Error("VAPID public key must be an uncompressed P-256 key");
    }
    return bytes.buffer;
  };

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

      await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
      const registration = await navigator.serviceWorker.ready;

      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error("VAPID public key not configured");
      }

      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      await api.post("/notifications/subscribe", { subscription });
      setIsSubscribed(true);
    } catch (err) {
      setError(
        err.message === "VAPID public key not configured"
          ? "Notifications are not configured yet. Add VITE_VAPID_PUBLIC_KEY to client/.env."
          : err.name === "AbortError"
          ? "This browser's push service is unavailable or rejected the subscription. Try Chrome or Edge in a normal window (not an in-app/embedded browser), then allow notifications for localhost."
          : err.message || "Failed to subscribe to push notifications",
      );
      console.error("Push subscription error:", err);
    }
  };

  const sendTestNotification = async () => {
    setError(null);
    setTestSent(false);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        setIsSubscribed(false);
        throw new Error("Enable notifications first");
      }
      await api.post("/notifications/test", { subscription });
      setTestSent(true);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.toLowerCase().includes("expired")) {
        setIsSubscribed(false);
      }
      setError(err.response?.data?.message || "Could not send test notification");
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
          <div className="flex items-center gap-3"><button onClick={sendTestNotification} className="rounded-full bg-primary px-3 py-2 text-body-sm font-medium text-on-primary">Send test</button><div className="flex items-center gap-2 text-[#22c55e]"><Check size={18} /><span className="text-body-sm font-medium">Active</span></div></div>
        ) : permission === "granted" ? (
          <button
            onClick={subscribeToPush}
            disabled={loading}
            className="rounded-full bg-primary px-4 py-2 text-body-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-50 transition-colors"
          >
            {loading ? "Enabling..." : "Enable Reminders"}
          </button>
        ) : (
          <button
            onClick={requestPermission}
            disabled={loading}
            className="rounded-full bg-primary px-4 py-2 text-body-sm font-medium text-on-primary hover:bg-primary-container disabled:opacity-50 transition-colors"
          >
            {loading ? "Requesting..." : "Enable Notifications"}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 text-body-sm text-error">{error}</p>
      )}
      {testSent && <p className="mt-3 text-body-sm text-[#22c55e]">Test notification sent.</p>}
    </div>
  );
};

export default NotificationSettings;
