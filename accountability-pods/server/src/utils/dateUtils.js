import { DateTime } from "luxon";
const getTodayInTimezone = (timezone) => {
  const today = DateTime.now().setZone(timezone);
  return today.toISODate();
}

const getDaysDifference = (date1, date2) => {
  const firstDate = DateTime.fromISO(date1).startOf("day");
  const secondDate = DateTime.fromISO(date2).startOf("day");
  return secondDate.diff(firstDate, 'days').days;
}

const getNextExpectedDate = (lastDate, frequency, customDays) => {
  const last = DateTime.fromISO(lastDate).startOf("day");
  
  if (frequency === "monthly") {
    return last.plus({ months: 1 }).toISODate();
  }
  
  if (frequency === "weekly" && customDays && customDays.length > 0) {
    const sortedDays = [...customDays].sort((a, b) => a - b);
    for (let i = 1; i <= 7; i++) {
      const nextDay = last.plus({ days: i });
      if (sortedDays.includes(nextDay.weekday)) {
        return nextDay.toISODate();
      }
    }
  }
  
  return last.plus({ days: 1 }).toISODate();
}

export {getTodayInTimezone, getDaysDifference, getNextExpectedDate }