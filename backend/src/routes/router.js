import { Router } from "express";

import authRouter from "./auth.route.js";
import complaintRouter from "./complaint.route.js";
import documentRouter from "./document.route.js";
import cctvRouter from "./cctv.route.js";
import aqiRouter from "./aqi.route.js";
import crimeRouter from "./crime.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/complaints", complaintRouter);
router.use("/documents", documentRouter);
router.use("/cctv", cctvRouter);
router.use("/aqi", aqiRouter);
router.use("/crimes", crimeRouter);

export default router;