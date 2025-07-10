import { Router } from "express";
import { createIndividual } from "../controller/database/individualController";

const router = Router();

/**
 * @route POST /individuals
 * @desc Create a new individual and associate it with an account
 */
router.post("/", async (req, res) => {
  try {
    await createIndividual(req, res);
  } catch (error) {
    res.status(500).send({ error: "An error occurred while creating the individual." });
  }
});

export default router;
