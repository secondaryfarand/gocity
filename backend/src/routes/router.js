import { Router } from "express";

// import homeRouter from "./home.route.js";
import authRouter from "./auth.route.js";
// import formRouter from "./form.route.js";

const router = Router();

// router.use("/home", homeRouter);
router.use("/auth", authRouter);
// router.use("/form", formRouter);

export default router;