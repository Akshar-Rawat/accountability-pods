import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import Streak from "../../models/streak.model.js";
import { createTestUser, createTestPod } from "../../test/helpers.js";

describe("Streak Flow & Routes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Integration: Streak Updates on Check-in", () => {
    it("should correctly update streaks over consecutive days, missed days, and new longest streaks", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      // Day 1: First check-in
      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 1" });

      let streak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(streak.currentStreak).toBe(1);
      expect(streak.longestStreak).toBe(1);
      expect(streak.lastCheckInDate).toBe("2026-01-01");

      // Day 2: Consecutive check-in
      vi.setSystemTime(new Date("2026-01-02T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 2" });

      streak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(streak.currentStreak).toBe(2);
      expect(streak.longestStreak).toBe(2);
      expect(streak.lastCheckInDate).toBe("2026-01-02");

      // Day 4: Missed a day (Day 3)
      vi.setSystemTime(new Date("2026-01-04T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 4" });

      streak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(streak.currentStreak).toBe(1);
      expect(streak.longestStreak).toBe(2); // Retained
      expect(streak.lastCheckInDate).toBe("2026-01-04");

      // Day 5: Consecutive check-in again
      vi.setSystemTime(new Date("2026-01-05T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 5" });
      
      streak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(streak.currentStreak).toBe(2);
      expect(streak.longestStreak).toBe(2);

      // Day 6: New Longest Streak!
      vi.setSystemTime(new Date("2026-01-06T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 6" });
      
      streak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(streak.currentStreak).toBe(3);
      expect(streak.longestStreak).toBe(3); // Updated
    });
  });

  describe("GET /api/v1/pods/:podId/streak", () => {
    it("should return the user's streak for the pod", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Setup Streak" });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streak`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.currentStreak).toBe(1);
      expect(res.body.data.longestStreak).toBe(1);
    });

    it("should return 404 if no streak exists", async () => {
      const { token, user } = await createTestUser();
      const pod = await createTestPod(user._id);

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streak`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 403 if user is not a member", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const nonMember = await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streak`)
        .set("Authorization", `Bearer ${nonMember.token}`);

      expect(res.status).toBe(403);
    });
  });
});
