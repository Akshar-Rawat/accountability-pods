import dotenv from "dotenv";
import { app } from "./app.js";
import { Server } from "socket.io";
import connectDb from "./db/index.js";
import http from "node:http";
import jwt from "jsonwebtoken";
import Pod from "./models/pods.model.js";
import Message from "./models/message.model.js";
import GlobalMessage from "./models/globalMessage.model.js";
import { setSocketIO } from "./utils/socket.js";
import { startNudgeCron } from "./services/nudgeCron.js";
dotenv.config({
  path: "./.env",
  quiet: true,
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("error in connect db ", error);
      throw error;
    });

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        credentials: true,
        origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()),
      },
    });

    setSocketIO(io);
    const onlineUsers = new Map();
    io.use((socket, next) => {
      const cookie = socket.handshake.headers.cookie;
      const accessToken = cookie
        ?.split("; ")
        .find((cookie) => cookie.trim().startsWith("accessToken="))
        ?.split("=")[1] || socket.handshake.auth?.token;
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
        );
        socket.user = decoded;
        console.log("socket authenticated:", decoded._id);
        next();
      } catch (error) {
        console.log("socket auth failed");
        next(new Error("socket auth failed"));
      }
    });
    io.on("connection", (socket) => {
      const userId = socket.user._id;
      const userSockets = onlineUsers.get(userId) || new Set();
      userSockets.add(socket.id);
      onlineUsers.set(userId, userSockets);
      socket.join("global-chat");
      io.to("global-chat").emit("global_presence", { onlineCount: onlineUsers.size });
      socket.emit("global_presence", { onlineCount: onlineUsers.size });
      let lastGlobalMessageAt = 0;
      console.log("socket connected:", socket.id, "user:", socket.user._id);

      socket.on("join_pod", async (podId) => {
        try {
          console.log("join_pod requested:", podId, "by user:", socket.user._id);

          const pod = await Pod.findOne({
            _id: podId,
            members: socket.user._id
          });

          if (!pod) {
            console.log("pod not found or user not a member");
            socket.emit("error", { message: "Pod not found or you are not a member" });
            return;
          }

          const roomName = `pod:${podId}`;
          socket.join(roomName);
          console.log(`user ${socket.user._id} joined room ${roomName}`);

          socket.emit("joined_pod", { podId, roomName });
        } catch (error) {
          console.error("error in join_pod:", error);
          socket.emit("error", { message: "Failed to join pod" });
        }
      });

      socket.on("send_message", async ({ podId, text }) => {
        try {
          if (!podId || !text || text.trim() === "") {
            socket.emit("error", { message: "Invalid message data" });
            return;
          }

          const pod = await Pod.findOne({
            _id: podId,
            members: socket.user._id
          });

          if (!pod) {
            socket.emit("error", { message: "Pod not found or you are not a member" });
            return;
          }

          const message = await Message.create({
            pod: podId,
            user: socket.user._id,
            text: text.trim(),
            type: "text",
          });

          const populatedMessage = await Message.findById(message._id).populate(
            "user",
            "username avatar"
          );

          const roomName = `pod:${podId}`;
          io.to(roomName).emit("new_message", populatedMessage);

          console.log(`message sent in room ${roomName} by user ${socket.user._id}`);
        } catch (error) {
          console.error("error in send_message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      });

      socket.on("send_global_message", async (text) => {
        try {
          const messageText = typeof text === "string" ? text.trim() : "";
          const now = Date.now();
          if (!messageText || messageText.length > 500) return socket.emit("error", { message: "Messages must be between 1 and 500 characters" });
          if (now - lastGlobalMessageAt < 700) return socket.emit("error", { message: "Please wait before sending another message" });
          lastGlobalMessageAt = now;
          const saved = await GlobalMessage.create({ user: userId, text: messageText });
          const populated = await GlobalMessage.findById(saved._id).populate("user", "username avatar");
          await GlobalMessage.find().sort({ createdAt: -1 }).skip(100).select("_id").then((old) => old.length && GlobalMessage.deleteMany({ _id: { $in: old.map((item) => item._id) } }));
          io.to("global-chat").emit("global_new_message", populated);
        } catch (error) {
          console.error("error in send_global_message:", error);
          socket.emit("error", { message: "Failed to send global message" });
        }
      });

      socket.on("report_global_message", async (messageId) => {
        try {
          const message = await GlobalMessage.findById(messageId);
          if (!message || message.user.equals(userId)) return socket.emit("error", { message: "That message cannot be reported" });
          await GlobalMessage.updateOne({ _id: messageId }, { $addToSet: { reportedBy: userId } });
          socket.emit("global_report_received", { messageId });
        } catch (error) {
          socket.emit("error", { message: "Could not report that message" });
        }
      });

      socket.on("disconnect", () => {
        const activeSockets = onlineUsers.get(userId);
        activeSockets?.delete(socket.id);
        if (activeSockets?.size === 0) onlineUsers.delete(userId);
        io.to("global-chat").emit("global_presence", { onlineCount: onlineUsers.size });
        console.log("socket disconnected:", socket.id, "user:", socket.user._id);
      });
    });
    server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running at port ${process.env.PORT || 5000}`);
      startNudgeCron();
    });
  })
  .catch((error) => {
    console.log("mongo db connection failed !!!", error);
  });
