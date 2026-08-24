import { describe, it, expect, vi } from "vitest";
import request from "supertest";

vi.mock("../../utils/cloudinary.js", () => ({
  uploadOnCloudinary: vi.fn().mockResolvedValue({ url: "http://example.com/avatar.jpg" }),
}));
import { app } from "../../app.js";
import { User } from "../../models/user.model.js";
import { createTestUser } from "../../test/helpers.js";

describe("Auth Routes", () => {
  describe("POST /api/v1/users/register", () => {
    it("should register a new user successfully", async () => {
      // Mocking multer file upload isn't strictly necessary if it's optional, 
      // but let's just send the fields and see if multer allows missing files. 
      // Usually, avatar is required, so we should send a dummy file.
      const res = await request(app)
        .post("/api/v1/users/register")
        .field("username", "newuser")
        .field("email", "newuser@example.com")
        .field("password", "password123")
        .field("timezone", "UTC")
        .attach("avatar", Buffer.from("dummy image data"), "avatar.jpg"); // Mock file upload

      // Check if registration was successful
      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe("newuser");

      // Verify in DB
      const dbUser = await User.findOne({ email: "newuser@example.com" });
      expect(dbUser).not.toBeNull();
      expect(dbUser.username).toBe("newuser");
    });
  });

  describe("POST /api/v1/users/login", () => {
    it("should login successfully with correct credentials", async () => {
      const { user } = await createTestUser({ password: "password123" });

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: user.email,
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it("should reject login with incorrect credentials", async () => {
      const { user } = await createTestUser({ password: "password123" });

      const res = await request(app)
        .post("/api/v1/users/login")
        .send({
          email: user.email,
          password: "wrongpassword",
        });

      // Based on ApiError, it usually sends 400 or 401
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("GET /api/v1/users/me (Authorization)", () => {
    it("should allow access with valid token", async () => {
      const { token, user } = await createTestUser();

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data._id.toString()).toBe(user._id.toString());
    });

    it("should reject access without token", async () => {
      const res = await request(app).get("/api/v1/users/me");

      expect(res.status).toBe(401);
    });
    
    it("should reject access with invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer invalidtoken123`);

      expect(res.status).toBe(401);
    });
  });
});
