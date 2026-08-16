import router from "./user.routes";

import { createPod } from "../controllers/pod.controller.js";


router.route("/create").post(createPod);