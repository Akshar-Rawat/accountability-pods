import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import usePodStore from "../stores/podStore";

const CreatePodPage = () => {
  const navigate = useNavigate();

  const createPod = usePodStore((state) => state.createPod);

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    frequency: "daily",
    customDays: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const days = [
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
    { label: "Sun", value: 7 },
  ];

  const frequencies = ["daily", "weekdays", "monthly", "custom"];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleDayChange = (day) => {
    setFormData((previous) => ({
      ...previous,
      customDays: previous.customDays.includes(day)
        ? previous.customDays.filter((item) => item !== day)
        : [...previous.customDays, day],
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.frequency === "custom" && formData.customDays.length === 0) {
      setError("Select at least one day.");
      return;
    }

    try {
      setLoading(true);

      await createPod({
        name: formData.name.trim(),
        goal: formData.goal.trim(),
        frequency: formData.frequency,
        customDays: formData.frequency === "custom" ? formData.customDays : [],
      });

      navigate("/pods");
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create pod.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-container px-5 py-8 md:px-16">
        <Link
          to="/pods"
          className="mb-6 inline-flex items-center gap-2 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to pods
        </Link>

        <div className="max-w-2xl">
          <div className="mb-7">
            <p className="text-label-caps font-semibold text-secondary">
              NEW POD
            </p>

            <h1 className="mt-2 text-headline-lg font-semibold text-primary">
              Create a Pod
            </h1>

            <p className="mt-2 text-body-md text-on-surface-variant">
              Create a focused space where a small group can work toward the
              same goal.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-outline-variant bg-surface p-7 shadow-xl shadow-primary/5 md:p-8"
          >
            <div className="space-y-5">
              {/* Pod name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-body-sm font-medium text-primary"
                >
                  Pod name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Morning Gym"
                  required
                  className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant transition-shadow focus:border-primary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              {/* Goal */}

              <div>
                <label
                  htmlFor="goal"
                  className="mb-2 block text-body-sm font-medium text-primary"
                >
                  Goal
                </label>

                <textarea
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="Write 500 words every day"
                  rows={3}
                  required
                  className="w-full resize-none rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant transition-shadow focus:border-primary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              {/* Frequency */}

              <fieldset>
                <legend className="mb-3 text-body-sm font-medium text-primary">
                  Frequency
                </legend>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {frequencies.map((frequency) => {
                    const isSelected = formData.frequency === frequency;

                    return (
                      <label
                        key={frequency}
                        className={`cursor-pointer rounded-lg border px-3 py-3 text-center text-body-sm capitalize transition-colors ${
                          isSelected
                            ? "border-primary bg-surface-container-low text-primary"
                            : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={frequency}
                          checked={isSelected}
                          onChange={handleChange}
                          className="sr-only"
                        />

                        {frequency}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Custom days */}

              {formData.frequency === "custom" && (
                <fieldset>
                  <legend className="mb-3 text-body-sm font-medium text-primary">
                    Select days
                  </legend>

                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => {
                      const isSelected = formData.customDays.includes(
                        day.value,
                      );

                      return (
                        <label
                          key={day.value}
                          className={`cursor-pointer rounded-lg border px-3 py-2 text-body-sm transition-colors ${
                            isSelected
                              ? "border-secondary bg-secondary-container text-on-secondary-container"
                              : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleDayChange(day.value)}
                            className="sr-only"
                          />

                          {day.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {/* Error */}

              {error && (
                <p role="alert" className="text-body-sm text-error">
                  {error}
                </p>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-body-sm font-semibold text-on-primary shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Pod"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreatePodPage;
