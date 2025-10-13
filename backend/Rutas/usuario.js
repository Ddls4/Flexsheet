// /Sockets/usuarioSocket.js
import bcrypt from "bcrypt";
import Usuario from "../Sockets/usuario.js"; // tu modelo mongoose de usuario

export default function usuarioSocket(io, socket) {
  // ----------------------------
  // Registrar usuario
  // ----------------------------
  socket.on("registrar_usuario", async ({ Nombre_U, Contraseña }, callback) => {
    try {
      const usuarioExistente = await Usuario.findOne({ Nombre_U });
      if (usuarioExistente) {
        return callback({ success: false, message: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(Contraseña, 10);

      const nuevoUsuario = await Usuario.create({
        Nombre_U,
        Contraseña: hashedPassword
      });

      callback({
        success: true,
        user: {
          _id: nuevoUsuario._id,
          Nombre_U: nuevoUsuario.Nombre_U
        }
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      callback({ success: false, message: "Error al registrar usuario" });
    }
  });

  // ----------------------------
  // Login usuario
  // ----------------------------
  socket.on("login_usuario", async ({ Nombre_U, Contraseña }, callback) => {
    try {
      const user = await Usuario.findOne({ Nombre_U });
      if (!user) return callback({ success: false, message: "Usuario no encontrado" });

      const match = await bcrypt.compare(Contraseña, user.Contraseña);
      if (!match) return callback({ success: false, message: "Contraseña incorrecta" });

      callback({
        success: true,
        user: {
          _id: user._id,
          Nombre_U: user.Nombre_U
        }
      });
    } catch (error) {
      console.error("Error en login:", error);
      callback({ success: false, message: "Error en login" });
    }
  });

  // ----------------------------
  // Obtener info de usuario
  // ----------------------------
  socket.on("obtener_usuario", async ({ id }, callback) => {
    try {
      const user = await Usuario.findById(id);
      if (!user) return callback({ success: false, message: "Usuario no encontrado" });

      callback({
        success: true,
        user: {
          _id: user._id,
          Nombre_U: user.Nombre_U
        }
      });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      callback({ success: false, message: "Error al obtener usuario" });
    }
  });
}
