import mongoose from 'mongoose';
import Negocio from "../models/negocio.js";

export default function negocioSockets(socket) {
    // Listar negocios públicos - ✅ BIEN
    socket.on("listar_negocios", async (data, callback) => {
        try {
            const negocios = await Negocio.find({ publico: true });
            callback({ negocios });
        } catch (err) {
            console.error("Error al listar negocios:", err);
            callback({ error: "Error interno del servidor" });
        }
    });

    // -------------------
    // * Menu de empresa en el frontend * 
    // -------------------

    socket.on("solicitar_cards", async (callback) => {
        try {
            console.log("🔍 Solicitud de cards recibida");
            
            if (!socket.user || !socket.user.id) {
                return callback({ error: "No autorizado" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            const negocios = await Negocio.find({ usuario: userId });
            console.log("✅ Negocios encontrados:", negocios.length);

            callback({
                cards: negocios.map((n) => ({
                    id: n._id,
                    Nombre_N: n.Nombre_N,
                    url_i: n.url_i,
                    Departamento: n.Departamento,
                    Ciudad: n.Ciudad,
                    servicios: n.servicios || [],
                    publico: n.publico || false
                })),
            });
        } catch (err) {
            console.error("❌ Error al obtener negocios:", err);
            callback({ error: "Error interno del servidor" });
        }
    });

    socket.on("crear_negocio", async (data, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            if (!data.Nombre_N || !data.departamento || !data.ciudad) {
                return callback({ success: false, message: "Faltan campos obligatorios" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);

            const nuevoNegocio = new Negocio({
                Nombre_N: data.Nombre_N,
                url_i: data.url_i || "",
                Departamento: data.departamento,
                Ciudad: data.ciudad,
                usuario: userId,
            });

            await nuevoNegocio.save();
            callback({ success: true, negocioId: nuevoNegocio._id });
        } catch (error) {
            console.error("Error al crear negocio:", error);
            callback({ success: false, message: "Error al crear negocio" });
        }
    });

    socket.on("eliminar_negocio", async ({ negocioId }, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR que el usuario sea dueño del negocio
            const negocio = await Negocio.findOne({ _id: negocioId, usuario: userId });
            if (!negocio) {
                return callback({ success: false, message: "Negocio no encontrado o no tienes permisos" });
            }

            await Negocio.findByIdAndDelete(negocioId);
            callback({ success: true, message: "Negocio eliminado con éxito" });
        } catch (err) {
            console.error("Error al eliminar negocio:", err);
            callback({ success: false, message: "Error del servidor" });
        }
    });

    socket.on("editar_negocio", async (data, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR que el usuario sea dueño del negocio
            const negocioExistente = await Negocio.findOne({ _id: data.negocioId, usuario: userId });
            if (!negocioExistente) {
                return callback({ success: false, message: "Negocio no encontrado o no tienes permisos" });
            }

            const camposActualizables = {};
            if (data.Nombre_N) camposActualizables.Nombre_N = data.Nombre_N;
            if (data.url_i) camposActualizables.url_i = data.url_i;
            if (data.departamento) camposActualizables.Departamento = data.departamento;
            if (data.ciudad) camposActualizables.Ciudad = data.ciudad;
            if (typeof data.publico === "boolean") camposActualizables.publico = data.publico;

            const negocioActualizado = await Negocio.findByIdAndUpdate(
                data.negocioId,
                { $set: camposActualizables },
                { new: true }
            );
            callback({ success: true, negocio: negocioActualizado });
        } catch (error) {
            console.error("Error al editar negocio:", error);
            callback({ success: false, message: "Error interno" });
        }
    });

    socket.on("actualizar_estado_publico", async (data, callback) => {
        try {
            const { negocioId, publico } = data;
            const result = await Negocio.findByIdAndUpdate(negocioId, { publico }, { new: true });
            if (!result) return callback({ success: false, message: "Negocio no encontrado" });

            callback({ success: true });
        } catch (err) {
            console.error("Error actualizando estado:", err);
            callback({ success: false, message: "Error en el servidor" });
        }
    });
    // -------------------
    // * Servicios dentro de Negocio* 
    // -------------------

    socket.on("obtener_servicios", async ({ negocioId }, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR permisos (solo dueño o negocio público)
            const negocio = await Negocio.findOne({
                _id: negocioId,
                $or: [
                    { usuario: userId }, // Dueño
                    { publico: true }    // O negocio público
                ]
            });

            if (!negocio) return callback({ success: false, message: "Negocio no encontrado" });

            callback({ success: true, servicios: negocio.servicios || [] });
        } catch (err) {
            console.error(err);
            callback({ success: false, message: "Error al obtener servicios" });
        }
    });

    socket.on("agregar_servicio", async (data, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const { negocioId, servicio } = data;

            if (!negocioId || !servicio || !servicio.titulo || !servicio.precio) {
                return callback({ success: false, message: "Datos incompletos" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR que el usuario sea dueño del negocio
            const negocio = await Negocio.findOne({ _id: negocioId, usuario: userId });
            if (!negocio) {
                return callback({ success: false, message: "Negocio no encontrado o no tienes permisos" });
            }

            if (!Array.isArray(negocio.servicios)) {
                negocio.servicios = [];
            }

            negocio.servicios.push(servicio);
            await negocio.save();

            callback({ success: true, servicios: negocio.servicios });
        } catch (err) {
            console.error("Error al agregar servicio:", err);
            callback({ success: false, message: "Error del servidor" });
        }
    });

    socket.on("eliminar_servicio", async (data, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const { negocioId, servicioId } = data;

            if (!negocioId || !servicioId) {
                return callback({ success: false, message: "Datos incompletos" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR que el usuario sea dueño del negocio
            const negocio = await Negocio.findOne({ _id: negocioId, usuario: userId });
            if (!negocio) {
                return callback({ success: false, message: "Negocio no encontrado o no tienes permisos" });
            }

            const serviciosActualizados = negocio.servicios.filter(
                (s) => s._id.toString() !== servicioId.toString()
            );

            if (serviciosActualizados.length === negocio.servicios.length) {
                return callback({ success: false, message: "Servicio no encontrado" });
            }

            negocio.servicios = serviciosActualizados;
            await negocio.save();

            callback({ success: true, servicios: negocio.servicios });
        } catch (err) {
            console.error("Error al eliminar servicio:", err);
            callback({ success: false, message: "Error del servidor" });
        }
    });

    socket.on("editar_servicio", async (data, callback) => {
        try {
            if (!socket.user) {
                return callback({ success: false, message: "No autorizado" });
            }

            const { negocioId, servicio } = data;

            if (!negocioId || !servicio || !servicio._id) {
                return callback({ success: false, message: "Datos incompletos" });
            }

            const userId = new mongoose.Types.ObjectId(socket.user.id);
            
            // ✅ VERIFICAR que el usuario sea dueño del negocio
            const negocio = await Negocio.findOne({ _id: negocioId, usuario: userId });
            if (!negocio) {
                return callback({ success: false, message: "Negocio no encontrado o no tienes permisos" });
            }

            const servicioIndex = negocio.servicios.findIndex(
                (s) => s._id.toString() === servicio._id.toString()
            );

            if (servicioIndex === -1) {
                return callback({ success: false, message: "Servicio no encontrado" });
            }

            negocio.servicios[servicioIndex] = {
                ...negocio.servicios[servicioIndex]._doc,
                ...servicio,
            };

            await negocio.save();

            callback({ success: true, servicios: negocio.servicios });
        } catch (err) {
            console.error("Error al editar servicio:", err);
            callback({ success: false, message: "Error del servidor" });
        }
    });
}