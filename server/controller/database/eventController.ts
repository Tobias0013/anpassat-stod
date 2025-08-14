import { Request, Response } from "express";
import { Event } from "../../resources/mongoose/eventModel";
import { Individual } from "../../resources/mongoose/individualModel";
import { ObjectId } from "mongodb";


export const getEvents = async (req: Request, res: Response) => {
  try {
    /* const individuald = req.params.id;
    const events = await Event.find();
    const individual = await Individual.findById(individuald);
    if (!individual) {
        return res.status(404).json({ message: "Individual not found" });
    }
    const individualEvents = events.filter(event => individual.event.includes(event._id));
    return res.status(200).json(individualEvents); */

    const individualId = req.params.id;

    const individual = await Individual.findById(individualId).populate('event');
    
    if (!individual) {
      res.status(404).json({ message: "Individual not found" });
    }else{
      res.status(200).json({ individualEvents: individual.event });
    }

  } catch (error) {
    res.status(500).json({
      message: "Failed to get events",
      error: (error as Error).message,
    });
  }
};


export const createEvent = async (req: Request, res: Response) => {
    try {
        const { individualId, eventDate, category, message } = req.body;

        const newEvent = new Event({
          eventDate,
          category,
          message,
        });

        await newEvent.save();

        const individual = await Individual.findById(individualId);
        
        if (!individual) {
            res.status(404).json({ message: "Individual not found" });
        }else {
          const documentId: ObjectId = newEvent._id as ObjectId;
          individual.event.push(documentId);
          await individual.save();
        }
        

        res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create event",
        error: (error as Error).message,
      });
    }
  };