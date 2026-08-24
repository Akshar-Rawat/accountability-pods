import { getDaysDifference } from "../utils/dateUtils.js";

const calculateStreak = ({
  currentStreak,
  longestStreak,
  lastCheckInDate,
  today,
}) => {
  if (!lastCheckInDate) {
    currentStreak = 1;
    longestStreak = 1;
    lastCheckInDate = today;

    return {
      currentStreak,
      longestStreak,
      lastCheckInDate,
    };
  }

  const daysDifference = getDaysDifference(
    lastCheckInDate,
    today
  );

  if (daysDifference === 1) {
    currentStreak += 1;

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
  } else if (daysDifference > 1) {
    currentStreak = 1;
  }

  lastCheckInDate = today;

  return {
    currentStreak,
    longestStreak,
    lastCheckInDate,
  };
};

export { calculateStreak };