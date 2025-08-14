import mongoose, { Schema, Document, Types } from "mongoose";

export enum EventCategory {
    TRANSPORT = "TRANSPORT",
    // KOMMUN = "KOMMUN",
    ÖVRIGT = "ÖVRIGT"
}

export interface IEvent extends Document {
  eventDate: Date;
  category: EventCategory;
  message: string;
}


const eventSchema = new Schema<IEvent>({
  eventDate: { type: Date, required: true },
  category: { type: String, enum: EventCategory, required: true },
  message: { type: String, required: true },
});


export const Event = mongoose.model<IEvent>("Event", eventSchema);
