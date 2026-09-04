import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";


const app=express()

// Public liveness probe for Render/UptimeRobot. Keep this before protected routes.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(
    cors({
 origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()),
credentials:true,
    })
)

app.use(express.json({ limit: "16kb" })); //limit how much data comes
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());


//routes import
import userRoutes from "./routes/user.routes.js";
import podRoutes from "./routes/pod.routes.js";
import CheckInRoutes from "./routes/checkIn.route.js";
import streakRoutes from "./routes/streak.route.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";
//routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/pods", podRoutes);
app.use("/api/v1/pods", CheckInRoutes);
app.use("/api/v1/pods", streakRoutes);
app.use("/api/v1/pods", messageRoutes);
app.use("/api/v1/notifications", notificationRoutes);
export {app}
