import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import CheckIn from "../../models/checkIn.model.js";
import Streak from "../../models/streak.model.js";
import { createTestUser, createTestPod } from "../../test/helpers.js";
import { getTodayInTimezone } from "../../utils/dateUtils.js";

describe("CheckIn Routes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("POST /api/v1/pods/:podId/checkins", () => {
    it("should create a check-in and initialize streak successfully", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Did my workout" });

      expect(res.status).toBe(201);

      // Verify DB CheckIn
      const dbCheckIn = await CheckIn.findOne({ pod: pod._id, user: user._id });
      expect(dbCheckIn).not.toBeNull();
      expect(dbCheckIn.note).toBe("Did my workout");
      expect(dbCheckIn.date).toBe("2026-01-01"); // Assuming getTodayInTimezone returns YYYY-MM-DD

      // Verify DB Streak initialized
      const dbStreak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(dbStreak).not.toBeNull();
      expect(dbStreak.currentStreak).toBe(1);
      expect(dbStreak.longestStreak).toBe(1);
      expect(dbStreak.lastCheckInDate).toBe("2026-01-01");
    });

    it("should reject check-in if user is not a member", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const nonMember = await createTestUser();

      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${nonMember.token}`)
        .send({ note: "Hacker checkin" });

      expect(res.status).toBe(403);
    });

    it("should prevent duplicate same-day check-in", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      // First check-in
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "First" });

      // Duplicate check-in
      const res = await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Second" });

      expect(res.status).toBe(409);

      // Verify streak did not increase
      const dbStreak = await Streak.findOne({ pod: pod._id, user: user._id });
      expect(dbStreak.currentStreak).toBe(1);
    });
  });

  describe("GET /api/v1/pods/:podId/checkins", () => {
    it("should return today's check-ins", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));

      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Done" });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].date).toBe("2026-01-01");
    });
  });

  describe("GET /api/v1/pods/:podId/checkins/history", () => {
    it("should return check-in history", async () => {
      const { token, user } = await createTestUser({ timezone: "UTC" });
      const pod = await createTestPod(user._id);

      vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 1" });

      vi.setSystemTime(new Date("2026-01-02T10:00:00Z"));
      await request(app)
        .post(`/api/v1/pods/${pod._id}/checkins`)
        .set("Authorization", `Bearer ${token}`)
        .send({ note: "Day 2" });

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/checkins/history`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].date).toBe("2026-01-02"); // Descending order
    });
  });
});
