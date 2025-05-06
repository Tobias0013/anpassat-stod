import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Din anslutningssträng från MongoDB Atlas:
const uri = process.env.URI;

// Anslutning till databasen
if(uri){
  mongoose
  .connect(uri)
  .then(() => {
    console.log("🚀 Ansluten till MongoDB!");
  })
  .catch((error) => {
    console.error("❌ Anslutningsfel:", error);
  });
}


// Exportera mongoose för att använda i andra filer
export default mongoose;
