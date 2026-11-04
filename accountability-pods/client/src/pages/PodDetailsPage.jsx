import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  MoreHorizontal,
  Flame
} from "lucide-react";

import usePodStore from "../stores/podStore";
import useAuthStore from "../stores/authStore";
import CheckInModal from "../components/CheckInModal";
import ChatPanel from "../components/ChatPanel";
import NotificationSettings from "../components/NotificationSettings";
import api from "../lib/axios";

const PodDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [checkInProofs, setCheckInProofs] = useState([]);

  const {
    currentPod,
    loading,
    error,
    getPodById,
    clearCurrentPod,
    podStreaks,
    myCurrentStreak,
    todaysCheckIns,
    getPodStreak,
    getTodaysCheckIns,
    getPodStreaks,
    checkIn,
    checkInLoading,
    leavePod
  } = usePodStore();

  useEffect(() => {
    getPodById(id);
    getPodStreak(id);
    getTodaysCheckIns(id);
    getPodStreaks(id);
    api.get(`/pods/${id}/checkins/proofs`).then((response) => {
      setCheckInProofs(Array.isArray(response.data?.data) ? response.data.data : []);
    }).catch(() => setCheckInProofs([]));

    return () => {
      clearCurrentPod();
    };
  }, [id, getPodById, getPodStreak, getTodaysCheckIns, getPodStreaks, clearCurrentPod]);

  const hasCheckedInToday = todaysCheckIns?.some(
    (c) => c.user?._id === user?._id || c.user === user?._id
  );

  const handleCheckInSubmit = async ({ note, photoUrl }) => {
    try {
      await checkIn(id, note, photoUrl);
      const response = await api.get(`/pods/${id}/checkins/proofs`);
      setCheckInProofs(Array.isArray(response.data?.data) ? response.data.data : []);
      setIsModalOpen(false);
    } catch {
      return;
    }
  };

  const handleLeavePod = async () => {
    if (window.confirm("Are you sure you want to leave this pod?")) {
      await leavePod(id);
      navigate("/pods");
    }
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-16">
          <div className="h-8 w-32 bg-surface-container rounded animate-pulse mb-16"></div>
          <div className="text-center mb-12">
            <div className="h-6 w-48 bg-surface-container rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-12 w-3/4 bg-surface-container rounded animate-pulse mx-auto"></div>
          </div>
          <div className="flex justify-center mb-24">
            <div className="w-64 h-64 rounded-full bg-surface-container animate-pulse"></div>
          </div>
          <div className="flex justify-center mb-16">
            <div className="w-48 h-24 rounded-2xl bg-surface-container animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !currentPod) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-16">
          <Link to="/pods" className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary">
            <ArrowLeft size={18} />
            Back to pods
          </Link>
          <div className="mt-8 rounded-xl border border-error bg-error-container p-5">
            <p className="text-body-sm text-error mb-3">{error || "Pod not found"}</p>
            <button
              onClick={() => {
                getPodById(id);
                getPodStreak(id);
                getTodaysCheckIns(id);
                getPodStreaks(id);
              }}
              className="text-body-sm font-semibold text-error hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-16">
        
        <div className="flex items-center justify-between mb-16">
          <Link
            to="/pods"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-primary hover:text-secondary"
          >
            <ArrowLeft size={18} />
            {currentPod.name}
          </Link>
          <div className="text-label-caps text-on-surface-variant">
            EST. 2026
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-label-caps font-semibold text-secondary uppercase tracking-widest mb-4">
            {currentPod.frequency} ACCOUNTABILITY
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-medium tracking-tight text-primary sm:text-4xl md:text-5xl">
            Consistency is the only metric that matters.
          </h1>
        </div>

        <div className="mb-16 flex justify-center">
          <button
            onClick={() => !hasCheckedInToday && setIsModalOpen(true)}
            disabled={hasCheckedInToday}
            aria-label={hasCheckedInToday ? "Checked in today" : "Check in for today's target"}
            className={`inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-body-md font-semibold shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary ${
              hasCheckedInToday
                ? "cursor-default border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]"
                : "bg-primary text-on-primary hover:bg-primary/90"
            }`}
          >
            <CheckCircle size={19} />
            <span>{hasCheckedInToday ? "Checked in today" : "Check in today"}</span>
          </button>
        </div>

        <div className="flex justify-center mb-16">
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Flame 
                size={32} 
                className={myCurrentStreak?.currentStreak > 0 ? "text-primary" : "text-on-surface-variant opacity-40"}
              />
              <span className="text-4xl font-bold text-primary">
                {myCurrentStreak?.currentStreak ?? 0}
              </span>
            </div>
            <p className="text-label-caps text-on-surface-variant mb-3">
              Current streak
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Longest: <span className="font-semibold text-primary">{myCurrentStreak?.longestStreak ?? 0} days</span>
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
            <h2 className="text-2xl font-semibold text-primary tracking-tight">Pod Leaderboard</h2>
            <span className="text-label-caps text-on-surface-variant">Active Streak Distribution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant text-label-caps text-on-surface-variant">
                  <th className="py-4 px-2 font-medium">Member</th>
                  <th className="py-4 px-2 font-medium hidden sm:table-cell">Goal / Progress</th>
                  <th className="py-4 px-2 font-medium text-center">Streak</th>
                  <th className="py-4 px-2 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {((podStreaks?.length ?? 0) > 0 ? podStreaks : (currentPod.members || []).map(m => ({ user: m, currentStreak: 0, longestStreak: 0 }))).map((streak, index) => {
                  const member = streak.user;
                  if (!member) return null;
                  const isCheckedInToday = todaysCheckIns?.some(
                    (c) => c.user?._id === member._id || c.user === member._id
                  );

                  return (
                    <tr key={member._id} className="border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-4">
                          {member.avatar ? (
                            <img src={member.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-body-sm font-semibold text-on-surface">
                              {member.username?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-body-md font-medium text-primary">
                              {member.username} {member._id === user?._id && "(You)"}
                            </p>
                            <p className="text-label-caps text-on-surface-variant">
                              {index === 0 ? "Current Champion" : "Challenger"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 hidden sm:table-cell align-middle">
                        <div className="w-48">
                          <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden mb-1">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${Math.min((streak.currentStreak / 31) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-on-surface-variant">{streak.currentStreak} / 31 DAYS</p>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center align-middle">
                        <span className="text-xl font-semibold text-primary">{streak.currentStreak}</span>
                      </td>
                      <td className="py-4 px-2 text-center align-middle">
                        <div className="flex justify-center">
                          {isCheckedInToday ? (
                            <CheckCircle size={18} className="text-[#22c55e]" />
                          ) : (
                            <MoreHorizontal size={18} className="text-on-surface-variant opacity-50" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <section className="mt-14 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-headline-md font-semibold text-primary">Check-in proof</h2>
              <p className="mt-1 text-body-sm text-on-surface-variant">Recent check-in photos and notes stay here, separate from chat.</p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-container px-3 py-1 text-label-caps text-on-surface-variant">{checkInProofs.length} recent</span>
          </div>
          {!checkInProofs.length ? (
            <p className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-body-sm text-on-surface-variant">No check-in proof yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {checkInProofs.map((checkIn, index) => {
                const member = checkIn.user?._id ? checkIn.user : currentPod.members?.find((item) => String(item._id) === String(checkIn.user));
                return <article key={checkIn._id || `${checkIn.user?._id || checkIn.user}-${index}`} className="overflow-hidden rounded-xl border border-outline-variant bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-body-sm font-semibold text-primary">{member?.username || (String(checkIn.user?._id || checkIn.user) === String(user?._id) ? user.username : "Pact member")}{String(checkIn.user?._id || checkIn.user) === String(user?._id) ? " · You" : ""}</p>
                    <span className="text-label-caps text-on-surface-variant">{checkIn.date}</span>
                  </div>
                  {checkIn.photoUrl && <a href={checkIn.photoUrl} target="_blank" rel="noreferrer" className="mb-3 block"><img src={checkIn.photoUrl} alt={`${member?.username || "Member"}'s check-in proof`} className="max-h-72 w-full rounded-lg object-cover" /></a>}
                  {checkIn.note && <p className="whitespace-pre-wrap text-body-sm text-on-surface-variant">{checkIn.note}</p>}
                  {!checkIn.photoUrl && !checkIn.note && <p className="text-body-sm text-on-surface-variant">Check-in complete. No photo or note added.</p>}
                </article>;
              })}
            </div>
          )}
        </section>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 border-t border-outline-variant pt-8">
           <p className="text-body-sm text-on-surface-variant">{currentPod.visibility === "public" ? "Public pact · discoverable by members" : "Private pact · invite code only"}</p>
           {String(currentPod.admin?._id || currentPod.admin) === String(user?._id) && <button disabled={visibilitySaving} onClick={async () => { setVisibilitySaving(true); try { await api.put(`/pods/${id}`, { visibility: currentPod.visibility === "public" ? "private" : "public" }); await getPodById(id); } finally { setVisibilitySaving(false); } }} className="text-body-sm font-medium text-primary underline disabled:opacity-50">{visibilitySaving ? "Updating…" : `Make ${currentPod.visibility === "public" ? "private" : "public"}`}</button>}
           <p className="text-body-sm text-on-surface-variant">
             Invite Code: <span className="font-mono font-bold text-primary">{currentPod.inviteCode}</span>
           </p>
           <button
             onClick={handleLeavePod}
             className="text-label-caps text-error hover:underline opacity-80 hover:opacity-100 transition-opacity"
           >
             Leave Pod
           </button>
        </div>

        <div className="mt-16">
          <ChatPanel podId={id} currentUserId={user?._id} />
        </div>

        <div className="mt-8">
          <NotificationSettings />
        </div>

      </div>

      <CheckInModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCheckInSubmit}
        isSubmitting={checkInLoading}
      />
    </section>
  );
};

export default PodDetailsPage;
