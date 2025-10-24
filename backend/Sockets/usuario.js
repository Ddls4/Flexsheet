// backend/Sockets/usuario.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  Nombre_U: { type: String, required: true, unique: true },
  Contraseña: { type: String, required: true },
  Tipo_empresa: { type: Boolean, default: false }
});

export default mongoose.model("Usuario", usuarioSchema);
