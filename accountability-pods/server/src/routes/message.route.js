import { Router } from "express";
import { getPodMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:podId/messages").get(verifyJWT, getPodMessages);

export default router;
