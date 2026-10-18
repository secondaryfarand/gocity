import { Router } from "express";

// import homeRouter from "./home.route.js";
import authRouter from "./auth.route.js";
import complaintRouter from "./complaint.route.js";

const router = Router();

// router.use("/home", homeRouter);
router.use("/auth", authRouter);
router.use("/complaints", complaintRouter);

export default router;