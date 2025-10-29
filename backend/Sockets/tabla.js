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
