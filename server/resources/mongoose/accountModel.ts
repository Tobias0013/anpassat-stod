import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IAccount extends Document {
  username: string;
  mail: string;
  password: string;
  careGiverId: mongoose.Types.ObjectId[];
}

const accountSchema = new Schema<IAccount>({
  username: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  careGiverId: [{ type: Schema.Types.ObjectId, ref: "CareGiver" }],
});

accountSchema.pre<IAccount>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const Account = mongoose.model<IAccount>("Account", accountSchema);
