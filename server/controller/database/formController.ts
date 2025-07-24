import { Request, Response } from "express";
import { Form } from "../../resources/mongoose/formModel";
import { Individual } from "../../resources/mongoose/individualModel";

/**
 * Creates a new form and links it to the *first* individual found under the account.
 * Expects req.body to include: { formId, type }
 */
export const createForm = async (req: Request, res: Response) => {
  try {
    const { formId, type, individualId, answers } = req.body;

    if (!formId || !type || !individualId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const individual = await Individual.findById(individualId);
    if (!individual) {
      return res.status(404).json({ message: "Individual not found" });
    }

    const newForm = new Form({
      formId,
      type,
      individualId,
      answers: answers || []
    });

    await newForm.save();

    await Individual.findByIdAndUpdate(individualId, {
      $push: { forms: newForm._id }
    });

    res.status(201).json({ message: "Form created", form: newForm });
  } catch (error) {
    console.error("[createForm ERROR]", error); // ⬅️ Lägg till denna
    res.status(500).json({
      message: "Failed to create form",
      error: (error as Error).message,
    });
  }
};



export const getFormById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const form = await Form.findOne({ formId: id });
  
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
  
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Error fetching form", error: (error as Error).message });
    }
  };
  
