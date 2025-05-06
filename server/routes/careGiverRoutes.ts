import { Router } from "express";
import {
  getCareGiverById,
  getIndividualsByCareGiverId,
  createCareGiver,
} from "../controller/database/careGiverController";

const router = Router();

router.get("/:id", getCareGiverById);
router.get("/:id/individuals", getIndividualsByCareGiverId);
router.post("/", createCareGiver);

export default router;
