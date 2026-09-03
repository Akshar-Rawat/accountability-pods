import { useEffect } from "react";
import usePodStore from "../stores/podStore";
import StreakBadge from "./StreakBadge";

const PodCardStreak = ({ podId }) => {
  const podStreaksCache = usePodStore((state) => state.podStreaksCache);
  const fetchStreakForPod = usePodStore((state) => state.fetchStreakForPod);

  useEffect(() => {
    fetchStreakForPod(podId);
  }, [podId, fetchStreakForPod]);

  const streak = podStreaksCache[podId] ?? 0;

  return <StreakBadge currentStreak={streak} className="bg-transparent px-0" />;
};

export default PodCardStreak;
