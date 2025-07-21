import { Request, Response } from "express";
import { Individual } from "../../resources/mongoose/individualModel";
import { Account } from "../../resources/mongoose/accountModel";

/**
 * Creates a new individual and links it to the account.
 *
 * @route POST /individuals
 * @param req - Express request object, expects name, age, county, gender, and accountId in body
 * @param res - Express response object
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

/**
 * Fetches the intro questions associated with a specific individual.
 *
 * @route GET /individuals/:id/introQuestions
 * @param req - Express request object, expects individual ID in params
 * @param res - Express response object
 */
export const getIndividualIntroQuestions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const individual = await Individual.findById(id).populate("introQuestions");

    if (!individual) {
      return res.status(404).json({ message: "Individual not found" });
    }

    return res.json(individual.introQuestions);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching intro questions",
      error: (error as Error).message,
    });
  }
};

/**
 * Fetches the forms associated with a specific individual.
 *
 * @route GET /individuals/:id/forms
 * @param req - Express request object, expects individual ID in params
 * @param res - Express response object
 */
export const getIndividualForms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const individual = await Individual.findById(id).populate("forms");

    if (!individual) {
      return res.status(404).json({ message: "Individual not found" });
    }

    return res.json(individual.forms);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching forms",
      error: (error as Error).message,
    });
  }
};

/**
 * Fetches the events associated with a specific individual.
 *
 * @route GET /individuals/:id/event
 * @param req - Express request object, expects individual ID in params
 * @param res - Express response object
 */
export const getIndividualEvents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const individual = await Individual.findById(id).populate("event");

    if (!individual) {
      return res.status(404).json({ message: "Individual not found" });
    }

    return res.json(individual.event);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching events",
      error: (error as Error).message,
    });
  }
};
