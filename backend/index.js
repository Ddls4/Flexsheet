// index.js
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initDB } from "./initDB.js";
import { verifySocketJWT } from "./JWT/authMiddleware.js";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

const app = express();
const server = createServer(app);

// Configuración CORS para Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:9001", // puerto del frontend
    methods: ["GET", "POST"],
  },
});

initDB();

// --- Webhook de Mercado Pago ---
app.post("/webhook", express.json(), (req, res) => {
  const data = req.body;
  console.log("💸 Notificación de Mercado Pago:", data);

  io.emit("payment_update", data); // emitir a todos los sockets conectados
  res.status(200).send("ok");
});

// Middleware JWT para sockets
io.use(verifySocketJWT);

// --- WebSockets ---
io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado:", socket.id);

  socket.on("mensaje", (data) => {
    console.log("💬 Mensaje recibido:", data);
    socket.emit("respuesta", `Echo: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

export { io, server };


// -------------------
// Tabla de usuario del negocio / historial de servicios del usuario
// -------------------

/*
  socket.on("cargar_tabla", async ({ cardid }, callback) => {
    try {
      const tablaEncontrada = await tabla.findOne({ cardid });
      if (!tablaEncontrada) return callback({ success: false, message: "Tabla no encontrada" });
      callback({ success: true, columns: tablaEncontrada.columns, rows: tablaEncontrada.rows });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al cargar tabla" });
    }
  });
*/


// Historial de servicios del usuario

// -------------------
// Tickets
// -------------------
/*
socket.on("crear_ticket", async (data, callback) => {
  try {
    const nuevoTicket = await ticket.create({
      Titulo: data.titulo,
      Descripcion: data.descripcion,
      Estado: "abierto",
      ID_U: data.idUsuario,
      ID_N: data.idNegocio,
      Fecha_creacion: new Date()
    });

    console.log("Ticket creado:", nuevoTicket);

    callback({
      success: true,
      message: "Ticket creado con éxito",
      ticket: nuevoTicket
    });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    callback({
      success: false,
      message: "Error al crear ticket"
    });
  }
});

socket.on("listar_tickets", async (callback) => {
  try {
    const tickets = await ticket.find();
    callback({ success: true, tickets });
  } catch (error) {
    console.error("Error al listar tickets:", error);
    callback({ success: false, message: "Error al listar tickets" });
  }
});
*/
// -------------------
  // Extras............ usuario al comprar 
  // -------------------