// backend/models/card.js
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  title: String,
  date: String,
  imagenURL: String,
  userId: String
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
