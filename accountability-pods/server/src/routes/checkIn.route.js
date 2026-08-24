import { Router } from "express";
import {
  createCheckIn,
  getTodaysCheckIns,
  getCheckInHistory
} from "../controllers/checkIn.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/:podId/checkins")
  .post(verifyJWT, createCheckIn)
  .get(verifyJWT, getTodaysCheckIns);

router.route("/:podId/checkins/history").get(verifyJWT, getCheckInHistory);

export default router;
