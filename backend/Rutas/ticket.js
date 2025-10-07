// /Rutas/tickets.js
import express from "express";
import Ticket from "../Sockets/ticket.js";

const router = express.Router();

// ----------------------------
// Crear ticket de soporte
// POST /tickets
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { Titulo, Descripcion, ID_U, ID_N } = req.body;

    if (!Titulo || !Descripcion || !ID_U) {
      return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
    }

    const nuevoTicket = await Ticket.create({
      Titulo,
      Descripcion,
      Estado: "Abierto",   // siempre empieza abierto
      ID_U,
      ID_N: ID_N || null,
      Fecha_creacion: new Date()
    });

    res.json({ success: true, ticket: nuevoTicket });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ success: false, message: "Error al crear ticket" });
  }
});

// ----------------------------
// Listar tickets de un usuario
// GET /tickets/usuario/:idUsuario
// ----------------------------
router.get("/usuario/:idUsuario", async (req, res) => {
  try {
    const tickets = await Ticket.find({ ID_U: req.params.idUsuario });
    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error al listar tickets:", error);
    res.status(500).json({ success: false, message: "Error al listar tickets" });
  }
});

// ----------------------------
// Obtener ticket por ID
// GET /tickets/:id
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket no encontrado" });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ success: false, message: "Error al obtener ticket" });
  }
});

// ----------------------------
// Actualizar estado de ticket (solo soporte)
// PATCH /tic
