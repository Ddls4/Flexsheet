import mongoose from "mongoose";

const negocioSchema = new mongoose.Schema({
  ID_N: String,
  Nombre_N: String,
  Tipo_N: String,
  Departamento: String,
  Ciudad: String
});

const Negocio = mongoose.model("Negocio", negocioSchema);
export default Negocio;
