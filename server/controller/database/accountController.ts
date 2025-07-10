import { Request, Response } from "express";
import { Account } from "../../resources/mongoose/accountModel";
import "../../resources/mongoose/individualModel"; // Ensure the Individual model is registered

/**
 * Retrieves all individuals associated with a specific account ID.
 *
 * @param {Request} req - The Express request object. Expects `req.params.id` to contain the account ID.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A JSON response containing an array of individuals with selected fields.
 */
export const getIndividualsByAccountId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const accountId = req.params.id;
    console.log("[AccountController] Received accountId:", accountId);

    const account = await Account.findById(accountId).populate("individualsId", "name _id");

    if (!account) {
      console.warn("[AccountController] Account not found in database.");
      return res.status(404).json({ message: "Account not found" });
    }

    console.log("[AccountController] Account found. Returning associated individuals.");
    return res.status(200).json({ individuals: account.individualsId });
  } catch (err) {
    console.error("[AccountController] Error fetching individuals:", err);
    return res.status(500).json({
      message: "Error fetching individuals for account",
      error: (err as Error).message,
    });
  }
};

