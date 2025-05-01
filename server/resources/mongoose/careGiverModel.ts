import mongoose, { Schema, Document } from "mongoose";

export interface ICareGiver extends Document {
  name: string;
  county: string;
  individuals: mongoose.Types.ObjectId[];
}

const careGiverSchema = new Schema<ICareGiver>({
  name: { type: String, required: true },
  county: { type: String, required: true },
  individuals: [{ type: Schema.Types.ObjectId, ref: "Individual" }],
});

export const CareGiver = mongoose.model<ICareGiver>("CareGiver", careGiverSchema);
