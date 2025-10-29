import mongoose from "mongoose";

const tablaSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
  columns: [{ type: String }],
  rows: [{ type: mongoose.Schema.Types.Mixed }], // filas con datos variados
  createdAt: { type: Date, default: Date.now }
});

const Tabla = mongoose.model("Tabla", tablaSchema);
export default Tabla;
