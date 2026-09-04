import { Router } from "express";
import { subscribeToNotifications, sendTestNotification } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, subscribeToNotifications);
router.route("/test").post(verifyJWT, sendTestNotification);

export default router;
