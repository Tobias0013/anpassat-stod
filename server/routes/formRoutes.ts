import { Router } from "express";
import {
	createForm,
	getFormById,
	updateFormAnswers,
	markFormAsComplete
  } from "../controller/database/formController";
  
  const router = Router();
  
  /**
   * @route POST /forms
   */
  router.post("/", async (req, res) => {
	try {
	  await createForm(req, res);
	} catch (error) {
	  res.status(500).json({ error: "An error occurred while creating the form." });
	}
  });
  
  /**
   * @route GET /forms/:id
   */
  router.get("/:id", async (req, res) => {
	try {
	  await getFormById(req, res);
	} catch (error) {
	  res.status(500).json({ error: "An error occurred while fetching the form." });
	}
  });
  
  /**
   * @route PATCH /forms/:id/answers
   */
  router.patch("/:id/answers", async (req, res) => {
	try {
	  await updateFormAnswers(req, res);
	} catch (error) {
	  res.status(500).json({ error: "An error occurred while updating the form answers." });
	}
  });
  
  /**
   * @route PATCH /forms/:id/complete
   */
  router.patch("/:id/complete", async (req, res) => {
	try {
	  await markFormAsComplete(req, res);
	} catch (error) {
	  res.status(500).json({ error: "An error occurred while marking the form complete." });
	}
  });
  
  export default router;
  