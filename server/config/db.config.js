import mongoose from "mongoose";

// URI de conexión a MongoDB Atlas / local. Se puede sobreescribir con la
// variable de entorno MONGO_URI (ver .env.example). Si no se define,
// se intenta conectar a una instancia local de Mongo.
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/coderhouse-backend";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
