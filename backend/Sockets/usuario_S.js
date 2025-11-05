// usuario_S.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";
import { generateToken } from "../JWT/generateToken.js";
import mongoSanitize from "mongo-sanitize";

const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_super_secreta_muy_larga_y_compleja";

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
      if (!data.password || data.password.length < 6 || data.password.length > 20) {
        return callback({ success: false, message: "Contraseña inválida." });
      }
      const usuarioExistente = await Usuario.findOne({ Nombre_U: data.username });
      console.log("🔍 Usuario existente:", usuarioExistente); // ← DEBUG
      if (usuarioExistente) {
        return callback({ success: false, message: "Usuario ya está en uso" });
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
      if (!data.password || data.password.length < 6 || data.password.length > 20) {
        return callback({ success: false, message: "Contraseña inválida." });
      }
      const username = mongoSanitize(data.username);
      const password = mongoSanitize(data.password);

      if (typeof username !== 'string' || typeof password !== 'string') {
        return callback({ success: false, message: "Datos inválidos" });
      }

      const user = await Usuario.findOne({ Nombre_U: username });
      if (!user) return callback({ success: false, message: "Usuario o contraseña incorrectos" });

      const isMatch = await bcrypt.compare(password, user.Contraseña);
      if (!isMatch) return callback({ success: false, message: "Usuario o contraseña incorrectos" });

      const token = generateToken({ id: user._id, nombre: user.Nombre_U, tipo_empresa: user.Tipo_empresa });

      callback({ success: true, token, user: { id: user._id, nombre: user.Nombre_U, tipo_empresa: user.Tipo_empresa } });
    } catch (error) {
      console.error("Error en login:", error);
      callback({ success: false, message: "Error en login" });
    }
  });

  // Para eventos que requieren autenticación
  socket.on("RegistroEmpresa", async (data, callback) => {
    try {
      const payload = jwt.verify(data.token, process.env.JWT_SECRET);
      
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        payload.id,
        { Tipo_empresa: true },
        { new: true }
      );

      if (!usuarioActualizado)
        return callback({ success: false, message: "Usuario no encontrado" });
      callback({ success: true, usuario: usuarioActualizado });
    } catch (error) {
      console.error("JWT inválido o error:", error);
      return callback({ success: false, message: "No autorizado" });
    }
  });
}