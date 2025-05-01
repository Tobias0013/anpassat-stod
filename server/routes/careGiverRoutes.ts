import { Router } from "express";
import {
  getCareGiverById,
  getIndividualsByCareGiverId,
  createCareGiver,
} from "../controller/database/careGiverController";

const router = Router();

router.get("/care-givers/:id", getCareGiverById);
router.get("/care-givers/:id/individuals", getIndividualsByCareGiverId);
router.post("/care-givers", createCareGiver);

export default router;
