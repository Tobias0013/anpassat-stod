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
    console.error("[createForm ERROR]", error); 
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

  /**
 * @route PATCH /forms/:id/answers
 * @desc Update answers for a form
 */
export const updateFormAnswers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid or missing answers array" });
    }

    const updatedForm = await Form.findOneAndUpdate(
      { formId: id },
      { $set: { answers, lastUpdatedDate: new Date() } },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Answers updated", form: updatedForm });
  } catch (error) {
    res.status(500).json({ message: "Failed to update answers", error: (error as Error).message });
  }
};

/**
 * @route PATCH /forms/:id/complete
 * @desc Mark form as complete and update lastUpdatedDate
 */
export const markFormAsComplete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedForm = await Form.findOneAndUpdate(
      { formId: id },
      { $set: { complete: true, lastUpdatedDate: new Date() } },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Form marked as complete", form: updatedForm });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark form as complete", error: (error as Error).message });
  }
};

  
