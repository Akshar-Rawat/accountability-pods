import { getDaysDifference, getNextExpectedDate } from "../utils/dateUtils.js";

const calculateStreak = ({
  currentStreak,
  longestStreak,
  lastCheckInDate,
  today,
  frequency = "daily",
  customDays = []
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

  const daysSinceLastCheckIn = getDaysDifference(lastCheckInDate, today);

  if (daysSinceLastCheckIn === 0) {
    return {
      currentStreak,
      longestStreak,
      lastCheckInDate,
    };
  }

  const expectedNextDate = getNextExpectedDate(lastCheckInDate, frequency, customDays);
  const diffFromExpected = getDaysDifference(expectedNextDate, today);

  if (diffFromExpected === 0) {
    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    lastCheckInDate = today;
  } else if (diffFromExpected > 0) {
    currentStreak = 1;
    lastCheckInDate = today;
  } else {
    // An early, non-scheduled check-in is useful to record, but it must not
    // count as an extra scheduled streak completion.
    lastCheckInDate = today;
  }

  return {
    currentStreak,
    longestStreak,
    lastCheckInDate,
  };
};

export { calculateStreak };
