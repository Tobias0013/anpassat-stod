/**
 * This file sets up the main router for the server.
 * It imports the Express Router and a sub-router from the "tmp" module,
 * then uses the sub-router for the "/tmp" route.
 */

import { Router } from "express";
import tmp from "./tmp";

const router = Router();

router.use("/tmp", tmp);

export default router;
