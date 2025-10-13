// /Rutas/card.js
import Card from "../Sockets/card.js";
import Negocio from "../Sockets/negocio.js";

export default (io) => {
  io.on("connect", (socket) => {
    console.log("Cliente conectado para gestión de cards:", socket.id);

    // --- iniciar edición (ocultar negocio)
    socket.on("start_edit_card", async ({ id }, callback) => {
      try {
        const card = await Card.findById(id);
        if (!card)
          return callback({ success: false, message: "Card no encontrada" });

        if (!card.ID_N)
          return callback({
            success: false,
            message: "Card no tiene negocio asociado",
          });

        // ocultar negocio
        const negocio = await Negocio.findByIdAndUpdate(
          card.ID_N,
          { visible: false },
          { new: true }
        );

        callback({ success: true, message: "Edición iniciada", negocio });
      } catch (error) {
        console.error("Error en start_edit_card:", error);
        callback({ success: false, message: "Error al iniciar edición" });
      }
    });

    // --- finalizar edición (mostrar negocio)
    socket.on("finish_edit_card", async ({ id, updates }, callback) => {
      try {
        const card = await Card.findByIdAndUpdate(id, updates, { new: true });
        if (!card)
          return callback({ success: false, message: "Card no encontrada" });

        if (!card.ID_N)
          return callback({
            success: false,
            message: "Card no tiene negocio asociado",
          });

        // mostrar negocio
        const negocio = await Negocio.findByIdAndUpdate(
          card.ID_N,
          { visible: true },
          { new: true }
        );

        callback({
          success: true,
          message: "Edición finalizada",
          card,
          negocio,
        });
      } catch (error) {
        console.error("Error en finish_edit_card:", error);
        callback({ success: false, message: "Error al finalizar edición" });
      }
    });
  });
};
