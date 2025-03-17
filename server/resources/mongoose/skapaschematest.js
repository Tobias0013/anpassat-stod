const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Individual Schema-definition
const individualSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  county: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "none"],
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
  county: { type: String, required: true },
  individuals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Individual" }],
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

// Testfunktion för lösenordskryptering
async function testPasswordEncryption() {
  try {
    await mongoose.connect(
      "mongodb+srv://anpassatstodxhkr:Hkrextrajobb1@anpassat-stod.jkde9.mongodb.net/?retryWrites=true&w=majority&appName=Anpassat-stod"
    );
    console.log("✅ MongoDB anslutet");

    const newCareGiver = new CareGiver({
      name: "Test CareGiver",
      county: "Stockholm",
    });

    const savedCareGiver = await newCareGiver.save();

    const testAccount = new Account({
      username: "testuser",
      mail: "test@mail.com",
      password: "HemligtLosen123",
      careGiverId: savedCareGiver._id,
    });

    const savedAccount = await testAccount.save();
    console.log("✅ Sparat konto med krypterat lösenord:", savedAccount);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Fel vid anslutning eller sparande:", error);
    mongoose.connection.close();
  }
}

// Kör testfunktionen
// testPasswordEncryption(); // Ta bort kommentar för att testa

// Exportera modellerna
module.exports = { Individual, CareGiver, Account };
