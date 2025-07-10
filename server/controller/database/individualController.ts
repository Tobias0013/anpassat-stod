import { Request, Response } from "express";
import { Individual } from "../../resources/mongoose/individualModel";
import { Account } from "../../resources/mongoose/accountModel";

/**
 * Creates a new individual and links it to the account.
 */
export const createIndividual = async (req: Request, res: Response) => {
  try {
    const { name, age, county, gender, accountId } = req.body;

    if (!name || !age || !county || !gender || !accountId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const individual = new Individual({ name, age, county, gender });
    await individual.save();

    // Add individual to account
    await Account.findByIdAndUpdate(accountId, {
      $push: { individualsId: individual._id },
    });

    return res.status(201).json({ message: "Individual created", individual });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create individual",
      error: (error as Error).message,
    });
  }
};
