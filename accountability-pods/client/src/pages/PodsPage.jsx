import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Flame } from "lucide-react";

import usePodStore from "../stores/podStore";

const PodsPage = () => {
  const navigate = useNavigate();
  const pods = usePodStore((state) => state.pods);
  const loading = usePodStore((state) => state.loading);
  const error = usePodStore((state) => state.error);
  const podStreaksCache = usePodStore((state) => state.podStreaksCache);
  const getMyPods = usePodStore((state) => state.getMyPods);
  const fetchStreakForPod = usePodStore((state) => state.fetchStreakForPod);
  const joinPod = usePodStore((state) => state.joinPod);

  const [inviteCode, setInviteCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    const code = inviteCode.trim();
    if (!code) return;
    setJoinError("");
    setJoinLoading(true);
    try {
      const pod = await joinPod(code);
      setInviteCode("");
      navigate(`/pods/${pod._id}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || "Invalid invite code.");
    } finally {
      setJoinLoading(false);
    }
  };

  useEffect(() => {
    getMyPods().catch(() => {});
  }, [getMyPods]);

  // Once pods load, fire off a streak fetch per pod (cached — won't re-fetch if already loaded)
  useEffect(() => {
    pods.forEach((pod) => {
      fetchStreakForPod(pod._id);
    });
  }, [pods, fetchStreakForPod]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-surface">
      <div className="mx-auto w-full max-w-container px-5 py-12 md:py-16 md:px-16">

        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-headline-xl text-headline-xl text-primary mb-2">Your Pods</h1>
          <p className="text-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Focus on discipline. Stay consistent with your groups.
          </p>
        </section>

        {/* Join pod with invite code */}
        <form
          onSubmit={handleJoin}
          className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-start"
        >
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  setJoinError("");
                }}
                placeholder="Enter invite code to join a pod..."
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={joinLoading || !inviteCode.trim()}
                className="shrink-0 rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-body-sm font-medium text-primary hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joinLoading ? "Joining..." : "Join"}
              </button>
            </div>
            {joinError && (
              <p className="mt-1.5 text-label-caps text-error">{joinError}</p>
            )}
          </div>
        </form>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 h-[280px]">
                <div className="h-10 w-10 bg-surface-container rounded-lg animate-pulse mb-6"></div>
                <div className="h-6 w-3/4 bg-surface-container rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-surface-container rounded animate-pulse mb-6"></div>
                <div className="flex -space-x-3 mb-8">
                  <div className="h-8 w-8 rounded-full bg-surface-container animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-surface-container animate-pulse"></div>
                  <div className="h-8 w-8 rounded-full bg-surface-container animate-pulse"></div>
                </div>
                <div className="h-2 w-full bg-surface-container rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-8 rounded-lg border border-error bg-error-container p-4">
            <p className="text-body-sm text-error mb-3">{error}</p>
            <button
              onClick={() => getMyPods()}
              className="text-body-sm font-semibold text-error hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && pods.length === 0 && (
          <div className="mb-8 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
            <h2 className="text-headline-md font-semibold text-primary">Your first pod starts here.</h2>
            <p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">Create a focused group or join one with an invite code to start building momentum together.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Pod Card */}
            <Link
              to="/pods/create"
              className="flex flex-col items-center justify-center h-full min-h-[280px] bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl hover:border-primary hover:bg-surface-container transition-all duration-300 group"
            >
              <div className="h-14 w-14 rounded-full border border-outline-variant flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} className="text-outline group-hover:text-primary" />
              </div>
              <span className="text-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">
                Create New Pod
              </span>
            </Link>

            {/* Pod Cards */}
            {pods.map((pod) => {
              const streak = podStreaksCache[pod._id];
              const progress = Math.min(Math.max((streak || 0) / 31 * 100, 0), 100);

              return (
                <Link
                  key={pod._id}
                  to={`/pods/${pod._id}`}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col justify-between hover:border-primary transition-colors duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-10 w-10 bg-primary flex items-center justify-center rounded-lg">
                        <Flame size={20} className="text-on-primary" />
                      </div>
                      <span className="text-label-caps text-label-caps text-secondary flex items-center gap-1">
                        <Flame size={16} className="fill-current" />
                        {streak || 0} days
                      </span>
                    </div>
                    <h3 className="text-headline-md text-headline-md text-primary mb-1">
                      {pod.name}
                    </h3>
                    <p className="text-body-sm text-body-sm text-on-surface-variant mb-6">
                      {pod.goal}
                    </p>
                    <p className="mb-6 text-label-caps text-on-surface-variant">{pod.members?.length || 0} / {pod.maxMembers || 5} MEMBERS</p>
                    <div className="flex -space-x-3 mb-8">
                      {pod.members?.slice(0, 3).map((member) => (
                        <div key={member._id} className="h-8 w-8 rounded-full border-2 border-surface-container-lowest overflow-hidden">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                              {member.username?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>
                      ))}
                      {pod.members?.length > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-surface-container-lowest bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                          +{pod.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-label-caps text-label-caps text-on-surface-variant">
                        Pod Progress
                      </span>
                      <span className="text-label-caps text-label-caps text-primary">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full h-[2px] bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile FAB for Create New Pod */}
        <Link
          to="/pods/create"
          className="md:hidden fixed bottom-8 right-8 h-14 w-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40"
        >
          <Plus size={24} />
        </Link>

      </div>
    </section>
  );
};

export default PodsPage;
