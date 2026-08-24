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
    lastCheckInDate = today;
  }

  return {
    currentStreak,
    longestStreak,
    lastCheckInDate,
  };
};

export { calculateStreak };