import { Router } from "express";
import { registerAccount, authAccount } from "../controller/database/authController";

const router = Router();

router.post("/register", registerAccount);
router.post("/login", authAccount);

export default router;
