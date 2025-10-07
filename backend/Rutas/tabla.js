// /Rutas/tabla.js
import express from "express";
import Tabla from "../Sockets/tabla.js";

const router = express.Router();

// ----------------------------
// Crear o actualizar tabla
// POST /tabla
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { cardId, columns, rows } = req.body;

    if (!cardId || !columns || !rows) {
      return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
    }

    // Buscar tabla existente
    let tabla = await Tabla.findOne({ cardId });

    if (tabla) {
      // Actualizar
      tabla.columns = columns;
      tabla.rows = rows;
      await tabla.save();
    } else {
      // Crear nueva
      tabla = await Tabla.create({ cardId, columns, rows });
    }

    res.json({ success: true, tabla });
  } catch (error) {
    console.error("Error al crear/actualizar tabla:", error);
    res.status(500).json({ success: false, message: "Error al crear/actualizar tabla" });
  }
});

// ----------------------------
// Obtener tabla por cardId
// GET /tabla/:cardId
// ----------------------------
router.get("/:cardId", async (req, res) => {
  try {
    const tabla = await Tabla.findOne({ cardId: req.params.cardId });
    if (!tabla) return res.status(404).json({ success: false, message: "Tabla no encontrada" });

    res.json({ success: true, tabla });
  } catch (error) {
    console.error("Error al obtener tabla:", error);
    res.status(500).json({ success: false, message: "Error al obtener tabla" });
  }
});

export default router;
