import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Register
router
  .route("/register")
  .post(upload.single("avatar"), registerUser);

// Login
router
  .route("/login")
  .post(loginUser);

// Refresh access token
router
  .route("/refresh")
  .post(refreshAccessToken);

// Logout
router
  .route("/logout")
  .post(verifyJWT, logoutUser);

// Get current user
router
  .route("/me")
  .get(verifyJWT, getCurrentUser);

// Change password
router
  .route("/change-password")
  .patch(verifyJWT, changeCurrentPassword);

// Update account details
router
  .route("/update-account")
  .patch(verifyJWT, updateAccountDetails);

export default router;