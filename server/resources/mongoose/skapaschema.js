const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('dotenv').config();

// Individual Schema-definition
const individualSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  county: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  introQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "IntroQuestion" },
  ],
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

// CareGiver Schema-definition
const careGiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  county: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  introQuestions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "IntroQuestion" },
  ],
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

// Account Schema-definition med lösenord hashing
const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  careGiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareGiver",
    required: true,
  },
});

// Hasha lösenord före sparning
accountSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Skapa modeller
const Individual = mongoose.model("Individual", individualSchema);
const CareGiver = mongoose.model("CareGiver", careGiverSchema);
const Account = mongoose.model("Account", accountSchema);

// Testa att skapa en ny Account med krypterat lösenord
async function testPasswordEncryption() {
  try {
    await mongoose.connect(
      process.env.URI
    );
    console.log("✅ MongoDB anslutet");

    const newCareGiver = new CareGiver({
      name: "TestCareGiver",
      age: 40,
      county: "Stockholm",
      gender: "male",
      introQuestions: [],
      forms: [],
      event: [],
    });

    const savedCareGiver = await newCareGiver.save();

    const testAccount = new Account({
      username: "testuser",
      mail: "test@mail.com",
      password: "HemligtLosen123", // kommer automatiskt hash:as
      careGiverId: savedCareGiver._id,
    });

    const savedAccount = await testAccount.save();
    console.log("✅ Sparad account med krypterat lösenord:", savedAccount);
  } catch (error) {
    console.error("❌ Fel vid test av kryptering:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Kör funktionen
// testPasswordEncryption();

// Exportera modellerna
module.exports = { Individual, CareGiver, Account };
