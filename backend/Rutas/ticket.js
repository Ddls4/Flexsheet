// /Rutas/tickets.js
import Ticket from "../Sockets/ticket.js";

export default function registrarTicketsHandlers(io) {
  io.on("connection", (socket) => {
    console.log("Cliente conectado a tickets:", socket.id);

    // ----------------------------
    // Crear ticket de soporte
    // ----------------------------
    socket.on("crear_ticket", async (data, callback) => {
      try {
        const { Titulo, Descripcion, ID_U, ID_N } = data;

        if (!Titulo || !Descripcion || !ID_U) {
          return callback({ success: false, message: "Faltan datos requeridos" });
        }

        const nuevoTicket = await Ticket.create({
          Titulo,
          Descripcion,
          Estado: "Abierto",
          ID_U,
          ID_N: ID_N || null,
          Fecha_creacion: new Date(),
        });

        callback({ success: true, ticket: nuevoTicket });
      } catch (error) {
        console.error("Error en crear_ticket:", error);
        callback({ success: false, message: "Error al crear ticket" });
      }
    });

    // ----------------------------
    // Listar tickets de un usuario
    // ----------------------------
    socket.on("listar_tickets_usuario", async ({ idUsuario }, callback) => {
      try {
        const tickets = await Ticket.find({ ID_U: idUsuario });
        callback({ success: true, tickets });
      } catch (error) {
        console.error("Error en listar_tickets_usuario:", error);
        callback({ success: false, message: "Error al listar tickets" });
      }
    });

    // ----------------------------
    // Obtener ticket por ID
    // ----------------------------
    socket.on("obtener_ticket", async ({ id }, callback) => {
      try {
        const ticket = await Ticket.findById(id);
        if (!ticket)
          return callback({ success: false, message: "Ticket no encontrado" });

        callback({ success: true, ticket });
      } catch (error) {
        console.error("Error en obtener_ticket:", error);
        callback({ success: false, message: "Error al obtener ticket" });
      }
    });

    // ----------------------------
    // Actualizar estado del ticket (solo soporte)
    // ----------------------------
    socket.on("actualizar_estado_ticket", async ({ id, nuevoEstado }, callback) => {
      try {
        const ticket = await Ticket.findByIdAndUpdate(
          id,
          { Estado: nuevoEstado },
          { new: true }
        );

        if (!ticket)
          return callback({ success: false, message: "Ticket no encontrado" });

        callback({ success: true, ticket });
      } catch (error) {
        console.error("Error en actualizar_estado_ticket:", error);
        callback({ success: false, message: "Error al actualizar ticket" });
      }
    });
  });
}
