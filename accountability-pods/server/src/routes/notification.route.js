import { Router } from "express";
import { subscribeToNotifications } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, subscribeToNotifications);

export default router;
