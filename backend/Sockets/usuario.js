// backend/Sockets/usuario.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  Nombre_U: { type: String, required: true, unique: true },
  Contraseña: { type: String, required: true }
});

export default mongoose.model("Usuario", usuarioSchema);
