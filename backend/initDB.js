// backend/initDB.js
import mongoose from "mongoose";
import Usuario from "./models/usuario.js";
import Negocio from "./models/negocio.js";
import Card from "./models/card.js";

// 1. Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ddfjg", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado"))
.catch((err) => console.error("Error en MongoDB:", err));

// 2. Insertar datos de prueba cuando la conexión esté abierta
mongoose.connection.once("open", async () => {
  console.log("Conexión abierta, insertando datos de prueba...");

  try {
    // Usuario de prueba
    const usuario = new Usuario({
      Nombre_U: "Gastón",
      Correo_electronico: "gaston@example.com",
      Contraseña: "123456",
      ID_U: "u001",
    });
    await usuario.save();

    // Negocio de prueba
    const negocio = new Negocio({
      Nombre_N: "Mi Negocio",
      Tipo_N: "Servicios",
      ID_N: "n001",
      ID_U: "u001",
      Departamento: "Montevideo",
      Ciudad: "Montevideo",
    });
    await negocio.save();

    // Card de prueba
    const card = new Card({
      Nombre_S: "Servicio 1",
      Imagen: "https://via.placeholder.com/150",
      Descripcion: "Descripción de prueba",
      Precio: 100,
      ID_S: "s001",
      ID_N: "n001",
    });
    await card.save();

    console.log("Datos insertados con éxito");
  } catch (error) {
    console.error("Error insertando datos:", error);
  } finally {
    mongoose.connection.close();
    console.log("Conexión cerrada");
  }
});
