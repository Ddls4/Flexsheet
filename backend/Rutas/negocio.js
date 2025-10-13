// /Rutas/negocio.js
import Negocio from "../Sockets/negocio.js";

export default (io) => {
  io.on("connect", (socket) => {
    console.log("Cliente conectado para gestión de negocios:", socket.id);

    // Crear un negocio (equivalente a "nueva_empresa")
    socket.on("crear_negocio", async (data, callback) => {
      try {
        const nuevoNegocio = new Negocio(data);
        await nuevoNegocio.save();
        callback({ success: true, negocio: nuevoNegocio });
      } catch (error) {
        console.error("Error al crear negocio:", error);
        callback({ success: false, message: "Error al crear negocio" });
      }
    });

    // Listar todos los negocios (equivalente a "solicitar_empresas")
    socket.on("listar_negocios", async (callback) => {
      try {
        const negocios = await Negocio.find();
        callback({ success: true, negocios });
      } catch (error) {
        console.error("Error al listar negocios:", error);
        callback({ success: false, message: "Error al obtener negocios" });
      }
    });

    // Listar negocios de un usuario (equivalente a "solicitar_empresa")
    socket.on("solicitar_empresa", async ({ idUsuario }, callback) => {
      try {
        const empresas = await Negocio.find({ ID_U: idUsuario });
        callback({ success: true, empresas });
      } catch (error) {
        console.error("Error al obtener empresas del usuario:", error);
        callback({ success: false, message: "Error al obtener empresas del usuario" });
      }
    });

    // Eliminar negocio por ID (equivalente a "delete_empresa")
    socket.on("eliminar_negocio", async ({ id }, callback) => {
      try {
        await Negocio.findByIdAndDelete(id);
        callback({ success: true, message: "Negocio eliminado correctamente" });
      } catch (error) {
        console.error("Error al eliminar negocio:", error);
        callback({ success: false, message: "Error al eliminar negocio" });
      }
    });
  });
};
