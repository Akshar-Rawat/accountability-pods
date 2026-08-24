import { User } from "../models/user.model.js";
import Pod from "../models/pods.model.js";
import { nanoid } from "nanoid";

export const createTestUser = async (overrides = {}) => {
  const user = await User.create({
    username: `testuser_${Date.now()}_${Math.random()}`,
    email: `test_${Date.now()}_${Math.random()}@example.com`,
    password: "password123",
    avatar: "http://example.com/avatar.jpg",
    ...overrides,
  });
  const token = user.generateAccessToken();
  return { user, token };
};

export const createTestPod = async (adminId, overrides = {}) => {
  const pod = await Pod.create({
    name: `Test Pod ${Date.now()}`,
    goal: "Test Goal",
    frequency: "daily",
    admin: adminId,
    members: [adminId],
    inviteCode: nanoid(10),
    ...overrides,
  });
  return pod;
};
