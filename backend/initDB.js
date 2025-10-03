// initDB.js
import mongoose from "mongoose";
import Usuario from "./models/usuario.js";
import Negocio from "./models/negocio.js";
import Card from "./models/card.js";

export async function initDB() {
  try {
    await mongoose.connect("mongodb+srv://DDFJG:culo123@cluster0.lwg6hol.mongodb.net/ddfjg?retryWrites=true&w=majority&appName=Cluster0", {
    });
      console.log("MongoDB conectado");

    // Insertar datos de prueba
    const usuario = new Usuario({
      Nombre_U: "Gastón",
      Contraseña: "123456",
      ID_U: "1",
    });
    await usuario.save();

    const negocio = new Negocio({
      Nombre_N: "Mi Negocio",
      Tipo_N: "Servicios",
      ID_N: "1",
      ID_U: "1",
      Departamento: "Montevideo",
      Ciudad: "Montevideo",
    });
    await negocio.save();

    const card = new Card({
      Nombre_S: "Servicio 1",
      Imagen: "https://via.placeholder.com/150",
      Descripcion: "Descripción de prueba",
      Precio: 100,
      ID_S: "1",
      ID_N: "1",
    });
    await card.save();

    console.log("Datos insertados con éxito");
  } catch (error) {
    console.error("Error insertando datos:", error);
  } finally {
    mongoose.connection.close();
    console.log("Conexión cerrada");
  }
}
