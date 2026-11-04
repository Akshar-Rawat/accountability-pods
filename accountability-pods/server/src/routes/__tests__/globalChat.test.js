import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../app.js";
import GlobalMessage from "../../models/globalMessage.model.js";
import { createTestUser } from "../../test/helpers.js";

describe("Global chat history", () => {
  it("requires authentication", async () => {
    const response = await request(app).get("/api/v1/global-chat/messages");
    expect(response.status).toBe(401);
  });

  it("returns only the latest 100 messages in chronological order", async () => {
    const { user, token } = await createTestUser();
    const docs = Array.from({ length: 105 }, (_, index) => ({ user: user._id, text: `message ${index}`, createdAt: new Date(Date.now() + index) }));
    await GlobalMessage.insertMany(docs);
    const response = await request(app).get("/api/v1/global-chat/messages").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(100);
    expect(response.body.data[0].text).toBe("message 5");
    expect(response.body.data[99].text).toBe("message 104");
  });
});
