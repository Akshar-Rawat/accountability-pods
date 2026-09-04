import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import Pod from "../../models/pods.model.js";
import { createTestUser, createTestPod } from "../../test/helpers.js";
import mongoose from "mongoose";
import CheckIn from "../../models/checkIn.model.js";
import Streak from "../../models/streak.model.js";
describe("Pod Routes", () => {
  describe("POST /api/v1/pods", () => {
    it("should create a pod successfully", async () => {
      const { token, user } = await createTestUser();

      const res = await request(app)
        .post("/api/v1/pods")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Daily Pod",
          goal: "Workout",
          frequency: "daily",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Test Daily Pod");

      // Verify in DB
      const dbPod = await Pod.findById(res.body.data._id);
      expect(dbPod).not.toBeNull();
      expect(dbPod.admin.toString()).toBe(user._id.toString());
      expect(dbPod.members).toHaveLength(1);
      expect(dbPod.members[0].toString()).toBe(user._id.toString());
      expect(dbPod.inviteCode).toBeDefined();
      expect(dbPod.maxMembers).toBe(5);
    });

    it("should save the creator-selected max members per pod", async () => {
      const first = await createTestUser();
      const second = await createTestUser();
      const firstResponse = await request(app).post("/api/v1/pods").set("Authorization", `Bearer ${first.token}`).send({ name: "Small", goal: "Focus", frequency: "daily", maxMembers: 2 });
      const secondResponse = await request(app).post("/api/v1/pods").set("Authorization", `Bearer ${second.token}`).send({ name: "Large", goal: "Focus", frequency: "daily", maxMembers: 10 });
      expect(firstResponse.status).toBe(201);
      expect(secondResponse.status).toBe(201);
      expect(firstResponse.body.data.maxMembers).toBe(2);
      expect(secondResponse.body.data.maxMembers).toBe(10);
    });

    it("should reject creation if unauthenticated", async () => {
      const res = await request(app).post("/api/v1/pods").send({
        name: "Test",
        goal: "Test",
        frequency: "daily",
      });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/pods/my-pods", () => {
    it("should return user's pods", async () => {
      const { token, user } = await createTestUser();
      const pod = await createTestPod(user._id);

      const res = await request(app)
        .get("/api/v1/pods/my-pods")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]._id.toString()).toBe(pod._id.toString());
    });
  });

  it("should reject pod details access for a non-member", async () => {
    const admin = await createTestUser();
    const outsider = await createTestUser();
    const pod = await createTestPod(admin.user._id);
    const res = await request(app).get(`/api/v1/pods/${pod._id}`).set("Authorization", `Bearer ${outsider.token}`);
    expect(res.status).toBe(403);
  });

  describe("POST /api/v1/pods/join/:inviteCode", () => {
    it("should allow a user to join via invite code", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const newMember = await createTestUser();

      const res = await request(app)
        .post(`/api/v1/pods/join/${pod.inviteCode}`)
        .set("Authorization", `Bearer ${newMember.token}`);

      expect(res.status).toBe(200);

      // Verify in DB
      const dbPod = await Pod.findById(pod._id);
      expect(dbPod.members).toHaveLength(2);
      expect(dbPod.members.some(id => id.equals(newMember.user._id))).toBe(true);
    });

    it("should reject joining if already a member", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const res = await request(app)
        .post(`/api/v1/pods/join/${pod.inviteCode}`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it("should reject joining when pod is full", async () => {
      const admin = await createTestUser();
      const existingMember = await createTestUser();
      const pod = await createTestPod(admin.user._id, { maxMembers: 2, members: [admin.user._id, existingMember.user._id] });

      const newMember = await createTestUser();
      const res = await request(app)
        .post(`/api/v1/pods/join/${pod.inviteCode}`)
        .set("Authorization", `Bearer ${newMember.token}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("PUT /api/v1/pods/:id", () => {
    it("should update pod if user is admin", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const res = await request(app)
        .put(`/api/v1/pods/${pod._id}`)
        .set("Authorization", `Bearer ${admin.token}`)
        .send({ name: "Updated Pod Name" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated Pod Name");

      const dbPod = await Pod.findById(pod._id);
      expect(dbPod.name).toBe("Updated Pod Name");
    });

    it("should reject update if user is not admin", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);
      const member = await createTestUser();

      const res = await request(app)
        .put(`/api/v1/pods/${pod._id}`)
        .set("Authorization", `Bearer ${member.token}`)
        .send({ name: "Hacked Pod Name" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/v1/pods/:id/leave", () => {
    it("should remove member from pod", async () => {
      const admin = await createTestUser();
      const member = await createTestUser();
      const pod = await createTestPod(admin.user._id, {
        members: [admin.user._id, member.user._id],
      });

      const res = await request(app)
        .delete(`/api/v1/pods/${pod._id}/leave`)
        .set("Authorization", `Bearer ${member.token}`);

      expect(res.status).toBe(200);

      const dbPod = await Pod.findById(pod._id);
      expect(dbPod.members).toHaveLength(1);
    });

    it("should transfer admin rights if admin leaves and there are other members", async () => {
      const admin = await createTestUser();
      const member = await createTestUser();
      const pod = await createTestPod(admin.user._id, {
        members: [admin.user._id, member.user._id],
      });

      const res = await request(app)
        .delete(`/api/v1/pods/${pod._id}/leave`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);

      const dbPod = await Pod.findById(pod._id);
      expect(dbPod.admin.toString()).toBe(member.user._id.toString());
      expect(dbPod.members).toHaveLength(1);
    });
  });
  it("should delete pod, check-ins, and streak when the only member leaves", async () => {
  const { token, user } = await createTestUser();

  const pod = await createTestPod(user._id);

  // Create a check-in for the pod
  await CheckIn.create({
    pod: pod._id,
    user: user._id,
    date: "2026-01-01",
    note: "Test check-in",
  });

  // Create a streak for the pod
  await Streak.create({
    pod: pod._id,
    user: user._id,
    currentStreak: 1,
    longestStreak: 1,
    lastCheckInDate: "2026-01-01",
  });

  const res = await request(app)
    .delete(`/api/v1/pods/${pod._id}/leave`)
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);

  expect(res.body.message).toBe(
    "Pod deleted successfully as you were the last member"
  );

  // Pod should be deleted
  const deletedPod = await Pod.findById(pod._id);

  expect(deletedPod).toBeNull();

  // Check-ins should be deleted
  const checkIns = await CheckIn.find({
    pod: pod._id,
  });

  expect(checkIns).toHaveLength(0);

  // Streak should be deleted
  const streaks = await Streak.find({
    pod: pod._id,
  });

  expect(streaks).toHaveLength(0);
});

  describe("GET /api/v1/pods/:id/members", () => {
    it("should allow members to get pod members", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/members`)
        .set("Authorization", `Bearer ${admin.token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it("should reject non-members from getting pod members", async () => {
      const admin = await createTestUser();
      const pod = await createTestPod(admin.user._id);
      const nonMember = await createTestUser();

      const res = await request(app)
        .get(`/api/v1/pods/${pod._id}/members`)
        .set("Authorization", `Bearer ${nonMember.token}`);

      expect(res.status).toBe(403);
    });
  });
});
