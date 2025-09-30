import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema({
  ID_S: String,
  Nombre_S: String,
  Descripcion: String,
  Precio: Number,
  Contacto_S: String,
  ID_N: String // referencia al negocio
});

const Servicio = mongoose.model("Servicio", servicioSchema);
export default Servicio;
