// index.js
import path from "path";
import { servidor, io } from "./config.js"; // Servidor y Socket.io
import { initDB } from './initDB.js'; // BD
import { verifySocketJWT } from "./JWT/authMiddleware.js"; // JWT Middleware
import registerSocketHandlers from "./Sockets/index_S.js";

// -------------------
// Inicializaciones
// -------------------
initDB();
io.use(verifySocketJWT);

// -------------------
// Rutas HTTP básicas
// -------------------
servidor.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});
// -------------------
// Socket.io
// -------------------
io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  registerSocketHandlers(socket);

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

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