import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, ArrowRight } from "lucide-react";

import usePodStore from "../stores/podStore";

const PodsPage = () => {
  const pods = usePodStore((state) => state.pods);
  const loading = usePodStore((state) => state.loading);
  const error = usePodStore((state) => state.error);
  const getMyPods = usePodStore((state) => state.getMyPods);

  useEffect(() => {
    getMyPods().catch(() => {});
  }, [getMyPods]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-container px-5 py-8 md:px-16">

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-label-caps font-semibold text-secondary">
              ACCOUNTABILITY
            </p>

            <h1 className="mt-2 text-headline-lg font-semibold text-primary">
              My Pods
            </h1>

            <p className="mt-1 text-body-md text-on-surface-variant">
              Stay consistent with people working toward similar goals.
            </p>
          </div>

          <Link
            to="/pods/create"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-body-sm font-semibold text-on-primary hover:bg-primary-container"
          >
            <Plus size={18} />
            Create Pod
          </Link>
        </div>

        {loading && (
          <div className="mt-8 text-body-sm text-on-surface-variant">
            Loading your pods...
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            className="mt-8 rounded-lg border border-error bg-error-container p-4 text-body-sm text-error"
          >
            {error}
          </div>
        )}

        {!loading && !error && pods.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {pods.map((pod) => (
              <Link
                key={pod._id}
                to={`/pods/${pod._id}`}
                className="group rounded-xl border border-outline-variant bg-surface p-5 transition-colors hover:bg-surface-container-low"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-headline-md font-semibold text-primary">
                      {pod.name}
                    </h2>

                    <p className="mt-1 text-body-sm text-on-surface-variant">
                      {pod.goal}
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-1"
                  />
                </div>

                <div className="mt-5 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Users
                      size={17}
                      className="text-on-surface-variant"
                    />

                    <span className="text-body-sm text-on-surface-variant">
                      {pod.members?.length || 0} members
                    </span>
                  </div>

                  <span className="text-body-sm capitalize text-on-surface-variant">
                    {pod.frequency}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && pods.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-outline-variant px-6 py-12 text-center">
            <h2 className="text-headline-md font-semibold text-primary">
              No pods yet
            </h2>

            <p className="mt-2 text-body-md text-on-surface-variant">
              Create or join a pod to start building your streak.
            </p>

            <Link
              to="/pods/create"
              className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2.5 text-body-sm font-semibold text-on-primary hover:bg-primary-container"
            >
              Create your first pod
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default PodsPage;