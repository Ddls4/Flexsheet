// usuario_S.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";
import { generateToken } from "../JWT/generateToken.js";

const SECRET_KEY = process.env.JWT_SECRET || "claveSuperSegura";

// Middleware para verificar JWT por evento
function verifyEventJWT(socket, callback) {
  // Permitir siempre registro y login sin JWT
  if (socket.event === "registrar" || socket.event === "login") {
    return true;
  }
  
  // Para otros eventos, requerir JWT
  if (!socket.user) {
    callback({ success: false, message: "No autorizado - Token requerido" });
    return false;
  }
  
  return true;
}

export default function usuarioSockets(socket) {
  socket.on("registrar", async (data, callback) => {
    console.log("📨 Evento 'registrar' recibido:", data); // ← DEBUG
    try {
      const usuarioExistente = await Usuario.findOne({ Nombre_U: data.username });
      console.log("🔍 Usuario existente:", usuarioExistente); // ← DEBUG
      if (usuarioExistente) {
        return callback({ success: false, message: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      console.log("🔐 Contraseña hasheada"); // ← DEBUG
      const nuevoUsuario = await Usuario.create({
        Nombre_U: data.username,
        Contraseña: hashedPassword,
        Tipo_empresa: false,
      });
      console.log("✅ Usuario creado en BD:", nuevoUsuario); // ← DEBUG
      const token = generateToken({ id: nuevoUsuario._id, nombre: nuevoUsuario.Nombre_U });

      callback({
        success: true,
        message: "Usuario registrado con éxito",
        token,
        user: { id: nuevoUsuario._id, nombre: nuevoUsuario.Nombre_U },
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      callback({ success: false, message: "Error al registrar usuario" });
    }
  });

  socket.on("login", async (data, callback) => {
    try {
      const user = await Usuario.findOne({ Nombre_U: data.username });
      if (!user) return callback({ success: false, message: "Usuario o contraseña incorrectos" });

      const isMatch = await bcrypt.compare(data.password, user.Contraseña);
      if (!isMatch) return callback({ success: false, message: "Usuario o contraseña incorrectos" });

      const token = generateToken({ id: user._id, nombre: user.Nombre_U });

      callback({ success: true, token, user: { id: user._id, nombre: user.Nombre_U } });
    } catch (error) {
      console.error("Error en login:", error);
      callback({ success: false, message: "Error en login" });
    }
  });

  // Para eventos que requieren autenticación
  socket.on("RegistroEmpresa", async (data, callback) => {
    // Verificar JWT para este evento
    if (!socket.user) {
      return callback({ success: false, message: "No autorizado" });
    }

    try {
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        socket.user.id, // Usar ID del JWT
        { Tipo_empresa: true },
        { new: true }
      );
      if (!usuarioActualizado)
        return callback({ success: false, message: "Usuario no encontrado" });

      callback({ success: true, usuario: usuarioActualizado });
    } catch (error) {
      console.error("Error al registrar empresa:", error);
      callback({ success: false, message: "Error al registrar empresa" });
    }
  });
}