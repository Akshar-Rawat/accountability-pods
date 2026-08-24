import { calculateStreak } from "./streak.service.js";

console.log("Test 1: First check-in");

console.log(
  calculateStreak({
    currentStreak: 0,
    longestStreak: 0,
    lastCheckInDate: null,
    today: "2026-08-20",
  })
);

console.log("Test 2: Consecutive day");

console.log(
  calculateStreak({
    currentStreak: 1,
    longestStreak: 1,
    lastCheckInDate: "2026-08-20",
    today: "2026-08-21",
  })
);

console.log("Test 3: Same day");

console.log(
  calculateStreak({
    currentStreak: 2,
    longestStreak: 2,
    lastCheckInDate: "2026-08-21",
    today: "2026-08-21",
  })
);

console.log("Test 4: Missed day");

console.log(
  calculateStreak({
    currentStreak: 2,
    longestStreak: 2,
    lastCheckInDate: "2026-08-21",
    today: "2026-08-23",
  })
);

console.log("Test 5: New longest streak");

console.log(
  calculateStreak({
    currentStreak: 3,
    longestStreak: 3,
    lastCheckInDate: "2026-08-23",
    today: "2026-08-24",
  })
);