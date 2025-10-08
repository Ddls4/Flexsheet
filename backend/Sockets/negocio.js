// /Sockets/negocio.js
import mongoose from "mongoose";

const negocioSchema = new mongoose.Schema({
  ID_N: String,
  Nombre_N: String,
  // falta imgen
  // Datos para el filtro
  Tipo_N: String,
  Departamento: String,
  Ciudad: String,
  // visibilidad: si está en edición, se oculta
  visible: { type: Boolean, default: true }
});

const Negocio = mongoose.model("Negocio", negocioSchema);
export default Negocio;
