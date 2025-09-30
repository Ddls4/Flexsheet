// backend/registro.js
import mongoose from "mongoose";
import { io } from "./config.js"; // asumimos que acá exportás io
import Usuario from "./models/usuario.js";

// 1️⃣ Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ddfjg")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error en MongoDB:", err));

// 2️⃣ Escuchando conexiones de socket.io
io.on("connect", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  // 3️⃣ Evento para registrar usuario
  socket.on("registrar", async (data) => {
    try {
      const nuevoUsuario = await Usuario.create({
        ID_U: data.ID_U,
        Nombre_U: data.Nombre_U,
        Correo_electronico: data.Correo_electronico,
        Contraseña: data.Contraseña
      });

      socket.emit("registrar", {
        success: true,
        message: "Usuario registrado con éxito",
        user: nuevoUsuario
      });

      console.log(`Usuario registrado: ${nuevoUsuario.Nombre_U}`);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      socket.emit("registrar", { success: false, message: "Error al registrar usuario" });
    }
  });

  // 4️⃣ Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});
