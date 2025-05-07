import { Router } from "express";
import { getPublicKey } from "../controller/publicKeyController";

const router = Router();

router.get("/", getPublicKey);

export default router;
