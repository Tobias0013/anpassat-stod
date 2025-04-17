import mongoose, { Document, Schema } from "mongoose";

export interface IIndividual extends Document {
  name: string;
  age: number;
  county: string;
  gender: "male" | "female" | "none";
  introQuestions: mongoose.Types.ObjectId[];
  forms: mongoose.Types.ObjectId[];
  event: mongoose.Types.ObjectId[];
}

const individualSchema = new Schema<IIndividual>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  county: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "none"],
    required: true,
  },
  introQuestions: [{ type: Schema.Types.ObjectId, ref: "IntroQuestion" }],
  forms: [{ type: Schema.Types.ObjectId, ref: "Form" }],
  event: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

export const Individual = mongoose.model<IIndividual>("Individual", individualSchema);
