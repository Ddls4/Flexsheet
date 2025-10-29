import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "claveSuperSegura";

export function generateToken(userData) {
  const payload = {
    id: userData.id || userData._id,  // Asegurar que tenga ID
    nombre: userData.nombre || userData.Nombre_U
  };
  console.log("🔐 Generando token con payload:", payload);
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}