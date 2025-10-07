// initDB.js
import mongoose from "mongoose";
import Usuario from "./Sockets/usuario.js";
import Negocio from "./Sockets/negocio.js";
import Card from "./Sockets/card.js";
import dotenv from "dotenv";

dotenv.config();

export async function initDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado");

    // Verificar si ya existen datos
    const usuarioExiste = await Usuario.findOne({ ID_U: "1" });
    const negocioExiste = await Negocio.findOne({ ID_N: "1" });
    const cardExiste = await Card.findOne({ ID_S: "1" });

    if (!usuarioExiste) {
      const usuario = new Usuario({
        Nombre_U: "Gastón",
        Contraseña: "123456",
      });
      await usuario.save();
      console.log("Usuario insertado");
    }

    if (!negocioExiste) {
      const negocio = new Negocio({
        Nombre_N: "Mi Negocio",
        Tipo_N: "Servicios",
        ID_N: "1",
        ID_U: "1",
        Departamento: "Montevideo",
        Ciudad: "Montevideo",
      });
      await negocio.save();
      console.log("Negocio insertado");
    }

    if (!cardExiste) { 
      const card = new Card({
        title: "Servicio 1",
        date: "2023-10-01",
        imagenURL: "https://via.placeholder.com/150",
        ID_S: "1",
        ID_N: "1",
      });

      await card.save();
      console.log("Card insertada");
    }

    console.log("Datos iniciales verificados/insertados con éxito");
  } catch (error) {
    console.error("Error insertando datos:", error);
  }
}