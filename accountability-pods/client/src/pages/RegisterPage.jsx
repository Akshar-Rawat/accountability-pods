import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "../lib/axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!avatar) {
      setError("Please select a profile picture.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("timezone", formData.timezone);
      data.append("avatar", avatar);

      await api.post("/users/register", data);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-container items-center justify-center px-5 py-8 md:px-16">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          <div className="rounded-xl border border-outline-variant bg-surface p-6">
            <div className="mb-7">
              <p className="text-label-caps font-semibold text-secondary">
                GET STARTED
              </p>

              <h1 className="mt-2 text-headline-lg font-semibold text-primary">
                Create your account
              </h1>

              <p className="mt-2 text-body-sm text-on-surface-variant">
                Create an account and start building consistency with your pod.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-body-sm font-medium text-primary"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    autoComplete="username"
                    required
                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-body-sm font-medium text-primary"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-body-sm font-medium text-primary"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 pr-11 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="avatar"
                    className="mb-2 block text-body-sm font-medium text-primary"
                  >
                    Profile picture
                  </label>

                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    required
                    className="block w-full text-body-sm text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-surface-container-low file:px-4 file:py-2 file:font-medium file:text-primary hover:file:bg-surface-container-high"
                  />
                </div>

                <div>
                  <label
                    htmlFor="timezone"
                    className="mb-2 block text-body-sm font-medium text-primary"
                  >
                    Timezone
                  </label>

                  <input
                    id="timezone"
                    name="timezone"
                    type="text"
                    value={formData.timezone}
                    readOnly
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 text-body-sm text-on-surface-variant outline-none"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-body-sm text-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-5 py-3 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-secondary hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
