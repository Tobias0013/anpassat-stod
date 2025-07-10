/**
 * This file sets up the main router for the server.
 * It imports the Express Router and a sub-router from the "tmp" module,
 * then uses the sub-router for the "/tmp" route.
 */

import { Router } from "express";
import tmp from "./tmp";
import publicKeyRouter from "./keyRoutes";
import authRouter from "./authRoutes";
import accountRouter from "./accountRoutes";
import individualRouter from "./individualRoutes";

const router = Router();


router.use("/tmp", tmp);
router.use("/public-key", publicKeyRouter);
router.use("/auth", authRouter);
router.use("/accounts", accountRouter);
router.use("/individuals", individualRouter);

export default router;
