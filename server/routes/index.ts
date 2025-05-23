/**
 * This file sets up the main router for the server.
 * It imports the Express Router and a sub-router from the "tmp" module,
 * then uses the sub-router for the "/tmp" route.
 */

import { Router } from "express";
import tmp from "./tmp";
import careGiverRouter from "./careGiverRoutes";
import publicKeyRouter from "./keyRoutes";
import authRouter from "./authRoutes";

const router = Router();


router.use("/tmp", tmp);
router.use("/care-givers", careGiverRouter);
router.use("/public-key", publicKeyRouter);
router.use("/auth", authRouter);

export default router;
