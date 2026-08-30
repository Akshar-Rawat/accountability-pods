import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import useAuthStore from "../stores/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(formData);
      navigate("/pods");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials.",
      );
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
                WELCOME BACK
              </p>

              <h1 className="mt-2 text-headline-lg font-semibold text-primary">
                Log in to Pods
              </h1>

              <p className="mt-2 text-body-sm text-on-surface-variant">
                Continue building your consistency with your pod.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 pr-11 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-body-sm text-error"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-primary px-5 py-3 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-body-sm text-on-surface-variant">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-secondary hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

