// /Rutas/card.js
import express from "express";
import Card from "../Sockets/card.js";
import Negocio from "../Sockets/negocio.js";

const router = express.Router();

// --- iniciar edición (ocultar negocio)
router.post("/cards/:id/start-edit", async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);
    if (!card) return res.status(404).json({ success: false, message: "Card no encontrada" });
    if (!card.ID_N) return res.status(400).json({ success: false, message: "Card no tiene negocio asociado" });

    // ocultar negocio
    const negocio = await Negocio.findByIdAndUpdate(
      card.ID_N,
      { visible: false },
      { new: true }
    );

    res.json({ success: true, message: "Edición iniciada", negocio });
  } catch (error) {
    console.error("Error en start-edit:", error);
    res.status(500).json({ success: false, message: "Error al iniciar edición" });
  }
});

// --- finalizar edición (mostrar negocio)
router.post("/cards/:id/finish-edit", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // cambios opcionales en la card

    const card = await Card.findByIdAndUpdate(id, updates, { new: true });
    if (!card) return res.status(404).json({ success: false, message: "Card no encontrada" });

    if (!card.ID_N) return res.status(400).json({ success: false, message: "Card no tiene negocio asociado" });

    // mostrar negocio
    const negocio = await Negocio.findByIdAndUpdate(
      card.ID_N,
      { visible: true },
      { new: true }
    );

    res.json({ success: true, message: "Edición finalizada", card, negocio });
  } catch (error) {
    console.error("Error en finish-edit:", error);
    res.status(500).json({ success: false, message: "Error al finalizar edición" });
  }
});

export default router;
