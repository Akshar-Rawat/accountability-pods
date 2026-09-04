import { Router } from "express";
import {
  createCheckIn,
  getTodaysCheckIns,
  getCheckInHistory,
  uploadImage
} from "../controllers/checkIn.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import fs from "node:fs";

const router = Router();

const cleanupUploadedFile = (req, res, next) => {
  const cleanup = () => {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Failed to remove temporary upload:", error);
      }
    }
  };

  res.once("finish", cleanup);
  res.once("close", cleanup);
  next();
};

const parseImageUpload = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return next(error);
    }
    next();
  });
};

router
  .route("/:podId/checkins")
  .post(verifyJWT, createCheckIn)
  .get(verifyJWT, getTodaysCheckIns);

router.route("/:podId/checkins/history").get(verifyJWT, getCheckInHistory);
router.route("/upload-image").post(
  verifyJWT,
  parseImageUpload,
  cleanupUploadedFile,
  uploadImage,
);

export default router;
