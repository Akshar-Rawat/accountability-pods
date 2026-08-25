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

  // =========================================================
  // CHECK-IN → STREAK INTEGRATION
  // =========================================================

  describe("Integration: Streak Updates on Check-in", () => {
    it("should correctly update streaks over consecutive days, missed days, and new longest streaks", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      // Day 1: First check-in
      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 1",
        });

      let streak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(streak).not.toBeNull();
      expect(streak.currentStreak).toBe(1);
      expect(streak.longestStreak).toBe(1);
      expect(streak.lastCheckInDate).toBe("2026-01-01");

      // Day 2: Consecutive check-in
      vi.setSystemTime(new Date("2026-01-02T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 2",
        });

      streak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(streak.currentStreak).toBe(2);
      expect(streak.longestStreak).toBe(2);
      expect(streak.lastCheckInDate).toBe("2026-01-02");

      // Day 4: Missed Day 3
      vi.setSystemTime(new Date("2026-01-04T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 4",
        });

      streak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(streak.currentStreak).toBe(1);

      // Longest streak should remain 2
      expect(streak.longestStreak).toBe(2);
      expect(streak.lastCheckInDate).toBe("2026-01-04");

      // Day 5: Consecutive again
      vi.setSystemTime(new Date("2026-01-05T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 5",
        });

      streak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(streak.currentStreak).toBe(2);
      expect(streak.longestStreak).toBe(2);

      // Day 6: New longest streak
      vi.setSystemTime(new Date("2026-01-06T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 6",
        });

      streak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(streak.currentStreak).toBe(3);
      expect(streak.longestStreak).toBe(3);
      expect(streak.lastCheckInDate).toBe("2026-01-06");
    });
  });

  // =========================================================
  // GET STREAK
  // =========================================================

  describe("GET /api/v1/pods/:podId/streak", () => {
    it("should return the user's streak for the pod", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // Create a check-in first
      const checkInRes = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Setup Streak",
        });

      expect(checkInRes.status).toBe(201);

      // Get streak
      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streak`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.currentStreak).toBe(1);
      expect(res.body.data.longestStreak).toBe(1);
      expect(res.body.data.lastCheckInDate).toBe("2026-01-01");
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
      const { user: admin } = await createTestUser();

      const pod = await createTestPod(admin._id);

      const { token: nonMemberToken } = await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streak`)
        .set("Authorization", `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 401 if user is not authenticated", async () => {
      const { user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app).get(
        `/api/v1/pods/${pod._id}/streak`
      );

      expect(res.status).toBe(401);
    });

    it("should return 404 if the pod does not exist", async () => {
      const { token } = await createTestUser();

      const fakePodId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .get(`/api/v1/pods/${fakePodId}/streak`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  // =========================================================
  // GET POD STREAKS / LEADERBOARD
  // =========================================================

  describe("GET /api/v1/pods/:podId/streaks", () => {
    it("should return all pod streaks sorted by currentStreak descending", async () => {
      const { token, user: user1 } = await createTestUser({
        timezone: "UTC",
      });

      const { user: user2 } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user1._id);

      // Add second user to the pod
      pod.members.push(user2._id);
      await pod.save();

      // User 1 streak
      await Streak.create({
        pod: pod._id,
        user: user1._id,
        currentStreak: 3,
        longestStreak: 5,
        lastCheckInDate: "2026-01-03",
      });

      // User 2 streak
      await Streak.create({
        pod: pod._id,
        user: user2._id,
        currentStreak: 7,
        longestStreak: 10,
        lastCheckInDate: "2026-01-07",
      });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streaks`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data).toHaveLength(2);

      // Highest current streak should come first
      expect(res.body.data[0].currentStreak).toBe(7);
      expect(res.body.data[1].currentStreak).toBe(3);

      // Verify longest streak
      expect(res.body.data[0].longestStreak).toBe(10);
      expect(res.body.data[1].longestStreak).toBe(5);

      // Verify last check-in dates
      expect(res.body.data[0].lastCheckInDate).toBe("2026-01-07");
      expect(res.body.data[1].lastCheckInDate).toBe("2026-01-03");

      // Verify populated user
      expect(res.body.data[0].user).toBeDefined();
      expect(res.body.data[0].user.username).toBe(user2.username);

      expect(res.body.data[1].user).toBeDefined();
      expect(res.body.data[1].user.username).toBe(user1.username);
    });

    it("should return 404 if the pod does not exist", async () => {
      const { token } = await createTestUser();

      const fakePodId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .get(`/api/v1/pods/${fakePodId}/streaks`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 403 if user is not a member", async () => {
      const { user: admin } = await createTestUser();

      const pod = await createTestPod(admin._id);

      const { token: nonMemberToken } = await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streaks`)
        .set("Authorization", `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 401 if user is not authenticated", async () => {
      const { user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app).get(
        `/api/v1/pods/${pod._id}/streaks`
      );

      expect(res.status).toBe(401);
    });

    it("should return an empty array if the pod has no streaks", async () => {
      const { token, user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/streaks`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });
});