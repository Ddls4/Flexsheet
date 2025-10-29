
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ID_T: Number,
  Titulo: String,
  Descripcion: String,
  Estado: String,
  ID_U: String,
  ID_N: String,
  Fecha_creacion: Date
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
