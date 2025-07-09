import mongoose, { Document, Schema } from "mongoose";

export interface IIntroQuestion extends Document {
  id: string;
  answers: boolean[];
  habilitering: boolean[];
  kommunLss: boolean[];
  forsakringskassan: boolean[];
}

const introQuestionSchema = new Schema<IIntroQuestion>({
  id: { type: String, required: true },
  answers: {
    type: [Boolean],
    validate: [
      (arr: boolean[]) => arr.length === 12,
      "{PATH} must have exactly 12 boolean values",
    ],
    required: true,
  },
  habilitering: {
    type: [Boolean],
    validate: [
      (arr: boolean[]) => arr.length === 8,
      "{PATH} must have exactly 8 boolean values",
    ],
    required: true,
  },
  kommunLss: {
    type: [Boolean],
    validate: [
      (arr: boolean[]) => arr.length === 2,
      "{PATH} must have exactly 2 boolean values",
    ],
    required: true,
  },
  forsakringskassan: {
    type: [Boolean],
    validate: [
      (arr: boolean[]) => arr.length === 2,
      "{PATH} must have exactly 2 boolean values",
    ],
    required: true,
  },
});

export const IntroQuestion = mongoose.model<IIntroQuestion>(
  "IntroQuestion",
  introQuestionSchema
);
