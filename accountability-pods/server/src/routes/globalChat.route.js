import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getGlobalMessages } from "../controllers/globalChat.controller.js";

const router = Router();
router.get("/messages", verifyJWT, getGlobalMessages);
export default router;
