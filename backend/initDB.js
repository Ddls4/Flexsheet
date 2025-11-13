// initDB.js
import mongoose from "mongoose";
import Usuario from "./models/usuario.js";
import Negocio from "./models/negocio.js";

import dotenv from "dotenv";

dotenv.config();

export async function initDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}