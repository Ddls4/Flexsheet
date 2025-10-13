// /Rutas/servicio.js
import Servicio from "../Sockets/servicio.js";

export default (io) => {
  io.on("connect", (socket) => {
    console.log("Cliente conectado para gestión de servicios:", socket.id);

    //  Crear servicio 
    socket.on("crear_servicio", async (data, callback) => {
      try {
        const { Nombre_S, Descripcion, Precio, Contacto_S, ID_N } = data;

        const nuevoServicio = new Servicio({
          Nombre_S,
          Descripcion,
          Precio,
          Contacto_S,
          ID_N,
        });

        await nuevoServicio.save();

        callback({
          success: true,
          message: "Servicio creado con éxito",
          servicio: nuevoServicio,
        });
      } catch (error) {
        console.error("Error en crear_servicio:", error);
        callback({ success: false, message: "Error al crear servicio" });
      }
    });

    //  Listar todos los servicios (equivalente a GET /servicios)
    socket.on("listar_servicios", async (callback) => {
      try {
        const servicios = await Servicio.find();
        callback({ success: true, servicios });
      } catch (error) {
        console.error("Error en listar_servicios:", error);
        callback({ success: false, message: "Error al obtener servicios" });
      }
    });

    //  Listar servicios de un negocio (equivalente a GET /servicios/negocio/:idNegocio)
    socket.on("servicios_por_negocio", async ({ idNegocio }, callback) => {
      try {
        const servicios = await Servicio.find({ ID_N: idNegocio });
        callback({ success: true, servicios });
      } catch (error) {
        console.error("Error en servicios_por_negocio:", error);
        callback({
          success: false,
          message: "Error al obtener servicios del negocio",
        });
      }
    });

    //  Eliminar servicio (equivalente a DELETE /servicios/:id)
    socket.on("eliminar_servicio", async ({ id }, callback) => {
      try {
        const servicioEliminado = await Servicio.findByIdAndDelete(id);
        if (!servicioEliminado)
          return callback({
            success: false,
            message: "Servicio no encontrado",
          });

        callback({ success: true, message: "Servicio eliminado con éxito" });
      } catch (error) {
        console.error("Error en eliminar_servicio:", error);
        callback({ success: false, message: "Error al eliminar servicio" });
      }
    });
  });
};
