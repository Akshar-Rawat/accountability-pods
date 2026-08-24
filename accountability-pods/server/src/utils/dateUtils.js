import { DateTime } from "luxon";
const getTodayInTimezone = (timezone) => {
  const today = DateTime.now().setZone(timezone);
  return today.toISODate();
}
export {getTodayInTimezone}