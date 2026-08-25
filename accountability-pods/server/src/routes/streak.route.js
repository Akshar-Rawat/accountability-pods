import { Router } from "express";
import { getStreak,getPodStreaks } from "../controllers/streak.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router    
.route("/:podId/streak")
.get(verifyJWT, getStreak);

router
.route("/:podId/streaks")
.get(verifyJWT, getPodStreaks);

export default router;
