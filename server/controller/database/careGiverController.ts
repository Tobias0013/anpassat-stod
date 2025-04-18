import { Request, Response } from "express";
import { CareGiver } from "../../resources/mongoose/careGiverModel";
import { Individual } from "../../resources/mongoose/individualModel";
; 

export const getCareGiverById = async (req: Request, res: Response) => {
  try {
    const caregiver = await CareGiver.findById(req.params.id);
    if (!caregiver) return res.status(404).json({
         message: "Not found" });
    res.json({ careGiver: caregiver });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getIndividualsByCareGiverId = async (req: Request, res: Response) => {
  try {
    const caregiverId = req.params.id;
    const individuals = await Individual.find({ careGiverId: caregiverId }).select("_id name");
    res.json({ individuals });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createCareGiver = async (req: Request, res: Response) => {
    try {
      const { name, county } = req.body;
  
      const newCareGiver = new CareGiver({
        name,
        county,
        individuals: [],
      });
  
      const saved = await newCareGiver.save();
      res.status(201).json({ careGiver: saved });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  };
