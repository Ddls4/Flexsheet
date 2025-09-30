// backend/models/usuario.js
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  ID_U: String,
  Nombre_U: String,
  Correo_electronico: String,
  Contraseña: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
