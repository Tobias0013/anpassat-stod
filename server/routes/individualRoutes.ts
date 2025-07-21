import { Router } from "express";
import {
  createIndividual,
  getIndividualIntroQuestions,
  getIndividualForms,
  getIndividualEvents,
} from "../controller/database/individualController";

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

/**
 * @route GET /individuals/:id/introQuestions
 * @desc Get intro questions for an individual
 */
router.get("/:id/introQuestions", async (req, res) => {
  try {
    await getIndividualIntroQuestions(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch intro questions" });
  }
});

/**
 * @route GET /individuals/:id/forms
 * @desc Get forms for an individual
 */
router.get("/:id/forms", async (req, res) => {
  try {
    await getIndividualForms(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

/**
 * @route GET /individuals/:id/event
 * @desc Get events for an individual
 */
router.get("/:id/event", async (req, res) => {
  try {
    await getIndividualEvents(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;

