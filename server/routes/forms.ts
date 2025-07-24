import { Router } from "express";
import { createForm, getFormById } from "../controller/database/formController";

const router = Router();

/**
 * @route POST /forms
 * @desc Create a new form and link it to an individual
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
 * @desc Fetch a form by formId
 */
router.get("/:id", async (req, res) => {
	try {
		await getFormById(req, res);
	} catch (error) {
		res.status(500).json({ error: "An error occurred while fetching the form." });
	}
});

export default router;
