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

export {getTodayInTimezone, getDaysDifference }