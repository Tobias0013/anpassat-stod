
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  needNo: { type: Boolean, default: false },
  futureNeed: { type: Boolean, default: false },
  futureNeedDate: { type: String, default: null }, // or enum if restricted
  needYes: { type: Boolean, default: false },
  urgency: { type: Number, default: 3, min: 1, max: 5 },
  appliedYes: { type: Boolean, default: false },
  appliedDate: { type: Date, default: null },
  grantedYes: { type: Boolean, default: false },
  grantedDate: { type: Date, default: null },
  standardNo: { type: Boolean, default: false },
  feedback: { type: String, default: "" },
}, { _id: false });

const formAnswerSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  individualId: { type: mongoose.Schema.Types.ObjectId, ref: 'Individual', required: true },
  answers: [answerSchema],
  createdDate: { type: Date, default: Date.now },
  lastUpdatedDate: { type: Date, default: Date.now },
});

formAnswerSchema.pre('save', function (next) {
  this.lastUpdatedDate = new Date();
  next();
});

const FormAnswer = mongoose.model('FormAnswer', formAnswerSchema);

export default FormAnswer;
