import { Router } from "express";
import { getStreak } from "../controllers/streak.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
.route("/:podId/streak")
.get(verifyJWT, getStreak);

export default router;
