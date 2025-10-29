// Ese bloque de código es el middleware de verificación del token JWT, 
// es una parte clave para proteger tus rutas y sockets (WebSocket/Socket.IO) en el backend.
// authMiddleware.js
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_super_secreta_aqui_muy_larga_y_complej";


export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

// Middleware para proteger sockets

export function verifySocketJWT(socket, next) {
  try {
    // Permitir conexión sin token (se verificará por evento)
    if (!socket.handshake.auth?.token) {
      console.log("🔓 Conexión sin token - Solo permitido para registro/login");
      socket.user = null;
      return next();
    }

    // Si hay token, verificarlo
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("🔍 JWT decodificado:", decoded); // ← DEBUG de estructura
    socket.user = decoded;
    console.log("✅ Socket authenticated for user:", decoded.nombre);
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    
    // Permitir conexión incluso con token inválido (para que pueda reconectar)
    socket.user = null;
    next();
  }
}