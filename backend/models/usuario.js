// backend/models/usuario.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  ID_U: Number,
  Nombre_U: String,
  Contraseña: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
