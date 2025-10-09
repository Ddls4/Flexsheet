// /Sockets/negocio.js
import mongoose, { Schema } from "mongoose";

const negocioSchema = new mongoose.Schema({
  Nombre_N: String,
  url_i: String,
  // Datos para el filtro
  Departamento: String,
  Ciudad: String,
  // visibilidad: si está en edición, se oculta
  usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  visible: { type: Boolean, default: true },
});

const Negocio = mongoose.model("Negocio", negocioSchema);
export default Negocio;
