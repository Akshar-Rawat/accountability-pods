import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";

import { app } from "../../app.js";
import CheckIn from "../../models/checkIn.model.js";
import Streak from "../../models/streak.model.js";
import { createTestUser, createTestPod } from "../../test/helpers.js";

describe("CheckIn Routes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // =========================================================
  // POST CHECK-IN
  // =========================================================

  describe("POST /api/v1/pods/:podId/checkins", () => {
    it("should create a check-in and initialize streak successfully", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Did my workout",
        });

      expect(res.status).toBe(201);

      // Verify CheckIn in database
      const dbCheckIn = await CheckIn.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(dbCheckIn).not.toBeNull();
      expect(dbCheckIn.note).toBe("Did my workout");
      expect(dbCheckIn.date).toBe("2026-01-01");

      // Verify Streak in database
      const dbStreak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(dbStreak).not.toBeNull();
      expect(dbStreak.currentStreak).toBe(1);
      expect(dbStreak.longestStreak).toBe(1);
      expect(dbStreak.lastCheckInDate).toBe("2026-01-01");
    });

    it("should reject check-in if user is not a member", async () => {
      const { user: admin } = await createTestUser();

      const pod = await createTestPod(admin._id);

      const { token: nonMemberToken } = await createTestUser();

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${nonMemberToken}`)
        .send({
          note: "Hacker checkin",
        });

      expect(res.status).toBe(403);
    });

    it("should prevent duplicate same-day check-in", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // First check-in
      const firstRes = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "First",
        });

      expect(firstRes.status).toBe(201);

      // Duplicate check-in
      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Second",
        });

      expect(res.status).toBe(409);

      expect(res.body.message).toBe(
        "You have already checked in today"
      );

      // Verify only one check-in exists
      const checkIns = await CheckIn.find({
        pod: pod._id,
        user: user._id,
        date: "2026-01-01",
      });

      expect(checkIns).toHaveLength(1);

      // Verify streak did not increase
      const dbStreak = await Streak.findOne({
        pod: pod._id,
        user: user._id,
      });

      expect(dbStreak.currentStreak).toBe(1);
      expect(dbStreak.longestStreak).toBe(1);
    });

    it("should return 409 when MongoDB throws a duplicate key error", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // Simulate MongoDB duplicate key error
      const duplicateError = new Error(
        "E11000 duplicate key error"
      );

      duplicateError.code = 11000;

      vi.spyOn(CheckIn, "create").mockRejectedValueOnce(
        duplicateError
      );

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Duplicate request",
        });

      expect(res.status).toBe(409);

      expect(res.body.message).toBe(
        "You have already checked in today"
      );
    });

    it("should return 404 if the pod does not exist", async () => {
      const { token } = await createTestUser();

      const fakePodId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .post(`/api/v1/pods/${fakePodId}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Test",
        });

      expect(res.status).toBe(404);
    });

    it("should return 401 if the user is not authenticated", async () => {
      const { user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .send({
          note: "Unauthenticated",
        });

      expect(res.status).toBe(401);
    });
  });

  // =========================================================
  // GET TODAY'S CHECK-INS
  // =========================================================

  describe("GET /api/v1/pods/:podId/checkins", () => {
    it("should return today's check-ins", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Done",
        });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].date).toBe("2026-01-01");
      expect(res.body.data[0].note).toBe("Done");
    });

    it("should return today's check-ins from multiple pod members", async () => {
      const { token: token1, user: user1 } =
        await createTestUser({
          timezone: "UTC",
        });

      const { token: token2, user: user2 } =
        await createTestUser({
          timezone: "UTC",
        });

      const pod = await createTestPod(user1._id);

      // Add second user to pod
      pod.members.push(user2._id);
      await pod.save();

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // User 1 checks in
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          note: "User 1",
        });

      // User 2 checks in
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          note: "User 2",
        });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);

      expect(res.body.data).toHaveLength(2);

      const dates = res.body.data.map((checkIn) => checkIn.date);

      expect(dates).toEqual([
        "2026-01-01",
        "2026-01-01",
      ]);
    });

    it("should return an empty array if nobody has checked in today", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("should return 403 if user is not a member of the pod", async () => {
      const { user: admin } = await createTestUser();

      const pod = await createTestPod(admin._id);

      const { token: nonMemberToken } =
        await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 if the pod does not exist", async () => {
      const { token } = await createTestUser();

      const fakePodId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .get(`/api/v1/pods/${fakePodId}/checkins`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 if the user is not authenticated", async () => {
      const { user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app).get(
        `/api/v1/pods/${pod._id}/checkins`
      );

      expect(res.status).toBe(401);
    });
  });

  // =========================================================
  // GET CHECK-IN HISTORY
  // =========================================================

  describe("GET /api/v1/pods/:podId/checkins/history", () => {
    it("should return check-in history sorted by date descending", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      // Day 1
      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      const firstRes = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 1",
        });

      expect(firstRes.status).toBe(201);

      // Day 2
      vi.setSystemTime(new Date("2026-01-02T10:00:00Z"));

      const secondRes = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 2",
        });

      expect(secondRes.status).toBe(201);

      // Day 3
      vi.setSystemTime(new Date("2026-01-03T10:00:00Z"));

      const thirdRes = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          note: "Day 3",
        });

      expect(thirdRes.status).toBe(201);

      // Get history
      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins/history`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      expect(res.body.data).toHaveLength(3);

      // History should be descending
      expect(res.body.data[0].date).toBe("2026-01-03");
      expect(res.body.data[1].date).toBe("2026-01-02");
      expect(res.body.data[2].date).toBe("2026-01-01");

      expect(res.body.data[0].note).toBe("Day 3");
      expect(res.body.data[1].note).toBe("Day 2");
      expect(res.body.data[2].note).toBe("Day 1");
    });

    it("should return an empty array if the user has no check-in history", async () => {
      const { token, user } = await createTestUser({
        timezone: "UTC",
      });

      const pod = await createTestPod(user._id);

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins/history`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("should return 403 if user is not a member of the pod", async () => {
      const { user: admin } = await createTestUser();

      const pod = await createTestPod(admin._id);

      const { token: nonMemberToken } =
        await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins/history`)
        .set("Authorization", `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });

    it("should return 404 if the pod does not exist", async () => {
      const { token } = await createTestUser();

      const fakePodId = "507f1f77bcf86cd799439011";

      const res = await request(app)
        .get(`/api/v1/pods/${fakePodId}/checkins/history`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("should return 401 if the user is not authenticated", async () => {
      const { user } = await createTestUser();

      const pod = await createTestPod(user._id);

      const res = await request(app).get(
        `/api/v1/pods/${pod._id}/checkins/history`
      );

      expect(res.status).toBe(401);
    });

    it("should only return the authenticated user's check-in history", async () => {
      const { token: token1, user: user1 } =
        await createTestUser({
          timezone: "UTC",
        });

      const { token: token2, user: user2 } =
        await createTestUser({
          timezone: "UTC",
        });

      const pod = await createTestPod(user1._id);

      // Add second user
      pod.members.push(user2._id);
      await pod.save();

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // User 1 checks in
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token1}`)
        .send({
          note: "User 1 check-in",
        });

      // User 2 checks in
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token2}`)
        .send({
          note: "User 2 check-in",
        });

      // Get User 1 history
      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins/history`)
        .set("Authorization", `Bearer ${token1}`);

      expect(res.status).toBe(200);

      expect(res.body.data).toHaveLength(1);

      expect(res.body.data[0].user.toString()).toBe(
        user1._id.toString()
      );

      expect(res.body.data[0].note).toBe(
        "User 1 check-in"
      );
    });
  });
});