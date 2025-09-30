// indexMongo.js
import path from "path";
import { servidor, io } from "./config.js";
import mongoose from "mongoose";
import usuario from "./models/usuario.js";
import negocio from "./models/negocio.js";
import servicio from "./models/servicio.js";
import card from "./models/card.js";
import tabla from "./models/tabla.js";

// -------------------
// Conexión a MongoDB
// -------------------
mongoose.connect("mongodb://127.0.0.1:27017/ddfjg")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error en MongoDB:", err));

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

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

  // -------------------
  // Usuario
  // -------------------
  socket.on("registrar_usuario", async ({ nombre, correo, contraseña }, callback) => {
    try {
      const nuevoUsuario = new usuario({ Nombre_U: nombre, Correo_electronico: correo, Contraseña: contraseña });
      await nuevoUsuario.save();
      callback({ success: true, message: "Usuario registrado" });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al registrar usuario" });
    }
  });

  socket.on("login_usuario", async ({ correo, contraseña }, callback) => {
    try {
      const user = await usuario.findOne({ Correo_electronico: correo, Contraseña: contraseña });
      if (!user) return callback({ success: false, message: "Usuario o contraseña incorrectos" });
      callback({ success: true, user: { id: user._id, nombre: user.Nombre_U } });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error en login" });
    }
  });

  // -------------------
  // Negocio
  // -------------------
  socket.on("crear_negocio", async (data, callback) => {
    try {
      const nuevoNegocio = new negocio(data);
      await nuevoNegocio.save();
      callback({ success: true, negocioId: nuevoNegocio._id });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al crear negocio" });
    }
  });

  socket.on("listar_negocios", async (callback) => {
    try {
      const negocios = await negocio.find();
      callback({ success: true, negocios });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al obtener negocios" });
    }
  });

  // -------------------
  // Servicio
  // -------------------
  socket.on("crear_servicio", async (data, callback) => {
    try {
      const nuevoServicio = new servicio(data);
      await nuevoServicio.save();
      callback({ success: true, servicioId: nuevoServicio._id });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al crear servicio" });
    }
  });

  socket.on("listar_servicios", async (callback) => {
    try {
      const servicios = await servicio.find();
      callback({ success: true, servicios });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al obtener servicios" });
    }
  });

  // -------------------
  // Card
  // -------------------
  socket.on("crear_card", async ({ nombre, fecha, imagenURL }, callback) => {
    try {
      const nuevaCard = new card({ Nombre_S: nombre, fecha, Imagen: imagenURL });
      await nuevaCard.save();
      callback({ success: true, cardId: nuevaCard._id });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al crear card" });
    }
  });

  socket.on("listar_cards", async (callback) => {
    try {
      const cards = await card.find();
      callback({ success: true, cards });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al obtener cards" });
    }
  });

  socket.on("eliminar_card", async ({ id }, callback) => {
    try {
      await card.findByIdAndDelete(id);
      callback({ success: true });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al eliminar card" });
    }
  });

  // -------------------
  // Tabla
  // -------------------
  socket.on("guardar_tabla", async ({ cardid, columns, rows }, callback) => {
    try {
      let tablaExistente = await tabla.findOne({ cardid });
      if (!tablaExistente) {
        tablaExistente = new tabla({ cardid, columns, rows });
      } else {
        tablaExistente.columns = columns;
        tablaExistente.rows = rows;
      }
      await tablaExistente.save();
      callback({ success: true, message: "Tabla guardada" });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al guardar tabla" });
    }
  });

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
});

// definís rutas, sockets, middlewares, etc.

// al final:
const PORT = 9000;
servidor.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
