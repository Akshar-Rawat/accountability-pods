import { Router } from "express";
import {
  createCheckIn,
  getTodaysCheckIns,
  getCheckInHistory,
  uploadImage
} from "../controllers/checkIn.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/:podId/checkins")
  .post(verifyJWT, createCheckIn)
  .get(verifyJWT, getTodaysCheckIns);

router.route("/:podId/checkins/history").get(verifyJWT, getCheckInHistory);
router.route("/upload-image").post(
  verifyJWT,
  upload.single("file"),
  uploadImage,
);

export default router;
