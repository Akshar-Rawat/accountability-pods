import { describe, it, expect } from "vitest";
import { calculateStreak } from "./streak.service.js";

describe("Streak Service", () => {
  it("should initialize streak on first check-in", () => {
    const result = calculateStreak({
      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      today: "2026-08-20",
    });
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastCheckInDate: "2026-08-20",
    });
  });

  it("should increment streak on consecutive day", () => {
    const result = calculateStreak({
      currentStreak: 1,
      longestStreak: 1,
      lastCheckInDate: "2026-08-20",
      today: "2026-08-21",
    });
    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-21",
    });
  });

  it("should not increment streak on same day", () => {
    // According to calculateStreak logic, if daysDiff === 0 (same day), it does nothing to streak, just returns it.
    const result = calculateStreak({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-21",
      today: "2026-08-21",
    });
    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-21",
    });
  });

  it("should reset current streak on missed day", () => {
    const result = calculateStreak({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-21",
      today: "2026-08-23",
    });
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 2,
      lastCheckInDate: "2026-08-23",
    });
  });

  it("should update longest streak correctly", () => {
    const result = calculateStreak({
      currentStreak: 3,
      longestStreak: 3,
      lastCheckInDate: "2026-08-23",
      today: "2026-08-24",
    });
    expect(result).toEqual({
      currentStreak: 4,
      longestStreak: 4,
      lastCheckInDate: "2026-08-24",
    });
  });

  it("should handle weekly streak with custom days (consecutive)", () => {
    // 2026-08-24 is a Monday. 1=Mon, 3=Wed, 5=Fri
    const result = calculateStreak({
      currentStreak: 1,
      longestStreak: 1,
      lastCheckInDate: "2026-08-24", 
      today: "2026-08-26", 
      frequency: "weekly",
      customDays: [1, 3, 5]
    });
    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-26",
    });
  });

  it("should handle weekly streak with custom days (missed)", () => {
    const result = calculateStreak({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-24", // Monday
      today: "2026-08-28", // Friday (missed Wednesday)
      frequency: "weekly",
      customDays: [1, 3, 5]
    });
    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 2,
      lastCheckInDate: "2026-08-28",
    });
  });

  it("should handle monthly streak (consecutive)", () => {
    const result = calculateStreak({
      currentStreak: 1,
      longestStreak: 1,
      lastCheckInDate: "2026-08-24",
      today: "2026-09-24",
      frequency: "monthly",
    });
    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-09-24",
    });
  });

  it("should maintain streak but update date on early bonus check-in", () => {
    const result = calculateStreak({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-24", // Monday
      today: "2026-08-25", // Tuesday (Bonus day!)
      frequency: "weekly",
      customDays: [1, 3, 5]
    });
    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastCheckInDate: "2026-08-25",
    });
  });
});