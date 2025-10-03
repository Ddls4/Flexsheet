import path from "path";
import { servidor, io } from "./config.js";
import usuario from "./models/usuario.js";
import negocio from "./models/negocio.js";
import servicio from "./models/servicio.js";
import card from "./models/card.js";
import tabla from "./models/tabla.js";
import bcrypt from "bcrypt";
import { initDB } from './initDB.js';

// -------------------
// Conexión a MongoDB
// -------------------
  initDB();

// -----------------
// --
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
socket.on("registrar", async (data, callback) => {
  try {
    console.log("Datos recibidos:", data);

    // 1️⃣ Verificar si ya existe el usuario
    const usuarioExistente = await Usuario.findOne({ Nombre_U: data.username });
    if (usuarioExistente) {
      return callback({
        success: false,
        message: "El nombre de usuario ya está en uso"
      });
    }

    // 2️⃣ Obtener o inicializar contador
    let counter = await Counter.findOne({ name: 'usuario_id' });
    if (!counter) {
      counter = await Counter.create({ name: 'usuario_id', value: 1 });
    } else {
      counter.value += 1;
      await counter.save();
    }

    // 3️⃣ Hashear contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 4️⃣ Crear usuario nuevo
    const nuevoUsuario = await Usuario.create({
      ID_U: counter.value,
      Nombre_U: data.username,
      Contraseña: hashedPassword
    });

    console.log("Usuario registrado:", nuevoUsuario);

    callback({
      success: true,
      message: "Usuario registrado con éxito",
      user: {
        ID_U: nuevoUsuario.ID_U,
        Nombre_U: nuevoUsuario.Nombre_U
        // ⚠️ No devolvemos la contraseña
      }
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    callback({
      success: false,
      message: "Error al registrar usuario"
    });
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
  // Crear card en menu de empresa
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
  // Mostrar card en menu de empresa
  socket.on("listar_cards", async (callback) => {
    try {
      const cards = await card.find();
      callback({ success: true, cards });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al obtener cards" });
    }
  });
  // Eliminar card en menu de empresa
  socket.on("eliminar_card", async ({ id }, callback) => {
    try {
      await card.findByIdAndDelete(id);
      callback({ success: true });
    } catch (error) {
      console.error(error);
      callback({ success: false, message: "Error al eliminar card" });
    }
  });
  // Editar card en menu de empresa


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
