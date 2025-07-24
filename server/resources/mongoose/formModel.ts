import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  need: { type: Boolean, default: false },
  futureNeed: { type: Boolean, default: false },
  futureNeedDate: { type: Date, default: null },
  priority: { type: Number, default: 3 }, // ← ändrat här!
  applied: { type: Boolean, default: false },
  appliedDate: { type: Date, default: null },
  granted: { type: Boolean, default: false },
  grantedDate: { type: Date, default: null },
  fitmentStandard: { type: Boolean, default: false },
  feedback: { type: String, default: "" }
}, { _id: false });


const FormSchema = new mongoose.Schema({
  formId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  individualId: { type: mongoose.Schema.Types.ObjectId, ref: "Individual", required: true },
  answers: [AnswerSchema],
  complete: { type: Boolean, default: false },
  lastUpdatedDate: { type: Date, default: null }
}, { timestamps: true });

export const Form = mongoose.model("Form", FormSchema);
