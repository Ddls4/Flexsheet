// /Rutas/tabla.js
import Tabla from "../models/tabla.js";

export default (io) => {
  io.on("connect", (socket) => {
    console.log("Cliente conectado para gestión de tablas:", socket.id);

    // 🟢 Crear o actualizar tabla
    socket.on("guardar_tabla", async (data, callback) => {
      try {
        const { cardId, columns, rows } = data;

        if (!cardId || !columns || !rows) {
          return callback({
            success: false,
            message: "Faltan datos requeridos",
          });
        }

        // Buscar si ya existe la tabla
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

        callback({ success: true, tabla });
      } catch (error) {
        console.error("Error en guardar_tabla:", error);
        callback({
          success: false,
          message: "Error al crear/actualizar tabla",
        });
      }
    });

    // 🟢 Obtener tabla por cardId
    socket.on("obtener_tabla", async ({ cardId }, callback) => {
      try {
        const tabla = await Tabla.findOne({ cardId });

        if (!tabla)
          return callback({
            success: false,
            message: "Tabla no encontrada",
          });

        callback({ success: true, tabla });
      } catch (error) {
        console.error("Error en obtener_tabla:", error);
        callback({
          success: false,
          message: "Error al obtener tabla",
        });
      }
    });
  });
};


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