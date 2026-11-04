import { Router } from "express";

import {
  createPod,
  getMyPods,
  getPodById,
  joinPod,
  leavePod,
  updatePod,
  getPodMembers,
  getPublicPods,
  joinPublicPod,
} from "../controllers/pod.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, createPod);

router
  .route("/my-pods")
  .get(verifyJWT, getMyPods);

router.route("/public").get(verifyJWT, getPublicPods);
router.route("/public/:id/join").post(verifyJWT, joinPublicPod);

router
  .route("/join/:inviteCode")
  .post(verifyJWT, joinPod);

router
  .route("/:id")
  .get(verifyJWT, getPodById)
  .put(verifyJWT, updatePod);

router
  .route("/:id/leave")
  .delete(verifyJWT, leavePod);

router
  .route("/:id/members")
  .get(verifyJWT, getPodMembers);

export default router;
