import { useState } from "react";
import useAuthStore from "../stores/authStore";
import usePodStore from "../stores/podStore";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateAccount = useAuthStore((state) => state.updateAccount);
  const pods = usePodStore((state) => state.pods);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    timezone: user?.timezone || "UTC",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await updateAccount(form);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background px-5 py-14 md:px-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-7 shadow-xl shadow-primary/5 md:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary-container text-2xl font-semibold text-on-secondary-container">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.username?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div>
              <p className="text-label-caps font-semibold text-secondary">
                YOUR PROFILE
              </p>
              <h1 className="mt-2 text-headline-xl font-semibold text-primary">
                {user?.username}
              </h1>
              <p className="text-body-md text-on-surface-variant">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-label-caps text-on-surface-variant">
                PODS JOINED
              </p>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {pods.length}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-label-caps text-on-surface-variant">
                TIMEZONE
              </p>
              <p className="mt-2 truncate text-body-sm font-semibold text-primary">
                {user?.timezone || "UTC"}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="text-label-caps text-on-surface-variant">
                MEMBER SINCE
              </p>
              <p className="mt-2 text-body-sm font-semibold text-primary">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditing((value) => !value)}
            className="mt-8 rounded-lg bg-primary px-5 py-3 text-body-sm font-semibold text-on-primary"
          >
            {editing ? "Cancel" : "Edit profile"}
          </button>
          {editing && (
            <form
              onSubmit={save}
              className="mt-8 space-y-4 border-t border-outline-variant pt-8"
            >
              <label className="block text-body-sm font-medium text-primary">
                Username
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5"
                  required
                />
              </label>
              <label className="block text-body-sm font-medium text-primary">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5"
                  required
                />
              </label>
              <button
                disabled={useAuthStore.getState().loading}
                className="rounded-lg bg-secondary px-5 py-3 text-body-sm font-semibold text-on-secondary"
              >
                Save changes
              </button>
            </form>
          )}
          {message && (
            <p className="mt-4 text-body-sm text-teal-700">{message}</p>
          )}
          {error && (
            <p role="alert" className="mt-4 text-body-sm text-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
export default ProfilePage;
