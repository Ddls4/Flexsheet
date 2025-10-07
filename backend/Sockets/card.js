// backend/models/card.js
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  date: String,
  imagenURL: String,
  ID_S: String,
  ID_N: String
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
