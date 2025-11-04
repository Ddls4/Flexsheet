import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_super_secreta_muy_larga_y_compleja";

export function generateToken(userData) {
  const payload = {
    id: userData.id || userData._id,  // Asegurar que tenga ID
    nombre: userData.nombre || userData.Nombre_U
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
}