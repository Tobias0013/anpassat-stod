const mongoose = require("mongoose");

// Din anslutningssträng från MongoDB Atlas:
const uri =
  "mongodb+srv://anpassatstodxhkr:Hkrextrajobb1@anpassat-stod.jkde9.mongodb.net/?retryWrites=true&w=majority&appName=Anpassat-stod";

// Anslutning till databasen
mongoose
  .connect(uri)
  .then(() => {
    console.log("🚀 Ansluten till MongoDB!");
  })
  .catch((error) => {
    console.error("❌ Anslutningsfel:", error);
  });

// Exportera mongoose för att använda i andra filer
module.exports = mongoose;
