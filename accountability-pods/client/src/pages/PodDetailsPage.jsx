import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Flame,
  CalendarDays,
  Copy,
} from "lucide-react";

import usePodStore from "../stores/podStore";

const PodDetailsPage = () => {
  const { id } = useParams();

  const {
    currentPod,
    loading,
    error,
    getPodById,
    clearCurrentPod,
  } = usePodStore();

  useEffect(() => {
    getPodById(id);

    return () => {
      clearCurrentPod();
    };
  }, [id, getPodById, clearCurrentPod]);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto w-full max-w-container px-5 py-8 md:px-16">
          <p className="text-body-sm text-on-surface-variant">
            Loading pod...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto w-full max-w-container px-5 py-8 md:px-16">
          <Link
            to="/pods"
            className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back to pods
          </Link>

          <div className="mt-8 rounded-xl border border-error bg-error-container p-5">
            <p className="text-body-sm text-error">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!currentPod) {
    return null;
  }

  const frequencyLabel =
    currentPod.frequency === "daily"
      ? "Every day"
      : currentPod.frequency === "weekly"
        ? "Custom days"
        : currentPod.frequency === "monthly"
          ? "Every month"
          : currentPod.frequency;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-container px-5 py-8 md:px-16">

        {/* Back */}
        <Link
          to="/pods"
          className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to pods
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-label-caps font-semibold text-secondary">
              ACCOUNTABILITY POD
            </p>

            <h1 className="mt-2 text-headline-lg font-semibold text-primary">
              {currentPod.name}
            </h1>

            <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
              {currentPod.goal}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-4 py-2.5">
            <CalendarDays
              size={17}
              className="text-secondary"
            />

            <span className="text-body-sm text-on-surface">
              {frequencyLabel}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <div className="flex items-center gap-2">
              <Users
                size={18}
                className="text-secondary"
              />

              <span className="text-body-sm text-on-surface-variant">
                Members
              </span>
            </div>

            <p className="mt-2 text-headline-md font-semibold text-primary">
              {currentPod.members?.length || 0}
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <div className="flex items-center gap-2">
              <Flame
                size={18}
                className="text-secondary"
              />

              <span className="text-body-sm text-on-surface-variant">
                Streak
              </span>
            </div>

            <p className="mt-2 text-headline-md font-semibold text-primary">
              0 days
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface p-4">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={18}
                className="text-secondary"
              />

              <span className="text-body-sm text-on-surface-variant">
                Frequency
              </span>
            </div>

            <p className="mt-2 text-body-sm font-semibold capitalize text-primary">
              {frequencyLabel}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">

          {/* Members */}
          <div className="rounded-xl border border-outline-variant bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-headline-md font-semibold text-primary">
                  Pod members
                </h2>

                <p className="mt-1 text-body-sm text-on-surface-variant">
                  People working toward this goal.
                </p>
              </div>

              <span className="rounded-full bg-surface-container-low px-3 py-1 text-body-sm text-on-surface-variant">
                {currentPod.members?.length || 0}/
                {currentPod.maxMembers}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              {currentPod.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-lg border border-outline-variant px-3 py-3"
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-body-sm font-semibold text-on-secondary-container">
                      {member.username?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-body-sm font-medium text-primary">
                      {member.username}
                    </p>

                    <p className="text-label-caps text-on-surface-variant">
                      Member
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pod information */}
          <div className="rounded-xl border border-outline-variant bg-surface p-5">
            <h2 className="text-headline-md font-semibold text-primary">
              Pod details
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <p className="text-label-caps text-on-surface-variant">
                  Frequency
                </p>

                <p className="mt-1 text-body-sm font-medium capitalize text-primary">
                  {frequencyLabel}
                </p>
              </div>

              {currentPod.frequency === "weekly" &&
                currentPod.customDays?.length > 0 && (
                  <div>
                    <p className="text-label-caps text-on-surface-variant">
                      Selected days
                    </p>

                    <p className="mt-1 text-body-sm text-primary">
                      {currentPod.customDays.join(", ")}
                    </p>
                  </div>
                )}

              <div>
                <p className="text-label-caps text-on-surface-variant">
                  Invite code
                </p>

                <div className="mt-1 flex items-center justify-between rounded-lg border border-outline-variant bg-background px-3 py-2">
                  <code className="text-body-sm text-primary">
                    {currentPod.inviteCode}
                  </code>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        currentPod.inviteCode,
                      )
                    }
                    className="text-on-surface-variant hover:text-primary"
                    aria-label="Copy invite code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodDetailsPage;