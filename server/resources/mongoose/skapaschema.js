const mongoose = require("./db");
const bcrypt = require("bcrypt");

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

// Forms Schema-definition
const formsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Kommun/LSS", "Habilitering", "Försäkringskassan"],
    required: true,
  },
  answers: [
    {
      id: { type: Number, required: true },
      need: { type: Boolean, required: true },
      futureNeed: { type: Boolean, required: true },
      futureNeedDate: { type: Date, default: null },
      priority: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
      applied: { type: Boolean, required: true },
      appliedDate: { type: Date, default: null },
      granted: { type: Boolean, required: true },
      grantedDate: { type: Date, default: null },
      meetStandard: { type: Boolean, required: true },
      feedback: { type: String, required: true },
    },
  ],
  complete: { type: Boolean, required: true },
  lastUpdatedDate: { type: Date, required: true, default: Date.now },
});

// Event Schema-definition
const eventSchema = new mongoose.Schema({
  eventDate: { type: Date, required: true },
  category: {
    type: String,
    enum: ["Kommun/LSS", "Habilitering", "Försäkringskassan"],
    required: true,
  },
  message: { type: String, required: true },
});

// Skapa modeller
const Individual = mongoose.model("Individual", individualSchema);
const CareGiver = mongoose.model("CareGiver", careGiverSchema);
const Account = mongoose.model("Account", accountSchema);
const Form = mongoose.model("Form", formsSchema);
const Event = mongoose.model("Event", eventSchema);

// Testfunktion för att verifiera scheman
async function testSchemas() {
  try {
    console.log("✅ MongoDB anslutet");

    const caregiver = await new CareGiver({
      name: "Anna",
      age: 30,
      county: "Stockholm",
      gender: "female",
    }).save();

    const individual = await new Individual({
      name: "Erik",
      age: 25,
      county: "Uppsala",
      gender: "male",
    }).save();

    const account = await new Account({
      username: "erik123",
      mail: "erik@mail.com",
      password: "password123",
      careGiverId: caregiver._id,
    }).save();

    const form = await new Form({
      type: "Kommun/LSS",
      answers: [
        {
          id: 1,
          need: true,
          futureNeed: false,
          priority: 3,
          applied: true,
          granted: false,
          meetStandard: true,
          feedback: "Bra jobbat",
        },
      ],
      complete: false,
    }).save();

    const event = await new Event({
      eventDate: new Date(),
      category: "Kommun/LSS",
      message: "Event created successfully",
    }).save();

    console.log("✅ Alla scheman sparade:", {
      caregiver,
      individual,
      account,
      form,
      event,
    });
  } catch (error) {
    console.error("❌ Fel vid test:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Kör testfunktionen
//testSchemas(); // Avkommentera för att köra testfunktionen

// Exportera modellerna
module.exports = { Individual, CareGiver, Account, Form, Event };
