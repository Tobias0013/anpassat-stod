import { Router } from "express";
import { getIndividualsByAccountId } from "../controller/database/accountController";

const router = Router();

/**
 * @route GET /accounts/:id/individuals
 * @desc Get all individuals for a specific account
 */
router.get("/:id/individuals", async (req, res) => {
	try {
		await getIndividualsByAccountId(req, res);
	} catch (error) {
		res.status(500).send({ error: "An error occurred while fetching individuals." });
	}
});

export default router;
