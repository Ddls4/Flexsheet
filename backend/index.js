import path from "path";
import { servidor, io } from "./config.js";
import Usuario from "./Sockets/usuario.js";
import Negocio from "./Sockets/negocio.js";
import Card from "./Sockets/card.js";

import tabla from "./Sockets/tabla.js";
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

      // Verificar si ya existe el usuario
      const usuarioExistente = await Usuario.findOne({ Nombre_U: data.username });
      if (usuarioExistente) {
        return callback({
          success: false,
          message: "El nombre de usuario ya está en uso"
        });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Crear usuario nuevo
      const nuevoUsuario = await Usuario.create({
        Nombre_U: data.username,
        Contraseña: hashedPassword
      });

      console.log("Usuario registrado:", nuevoUsuario.Nombre_U);

      callback({
        success: true,
        message: "Usuario registrado con éxito",
        user: {
          ID_U: nuevoUsuario._id,
          Nombre_U: nuevoUsuario.Nombre_U
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
  socket.on("login", async ({ username, password }, callback) => {
    console.log("Intentando login:", username);

    try {
      const user = await Usuario.findOne({ Nombre_U: username });
      console.log("Usuario encontrado:", user);

      if (!user) {
        return callback({ success: false, message: "Usuario o contraseña incorrectos" });
      }

      // Comparar contraseña ingresada con la contraseña hasheada en la base de datos
      const isMatch = await bcrypt.compare(password, user.Contraseña);

      if (!isMatch) {
        return callback({ success: false, message: "Usuario o contraseña incorrectos" });
      }

      // Si todo bien, retornar los datos del usuario
      callback({ success: true, user: { id: user._id, nombre: user.Nombre_U } });

    } catch (error) {
      console.error("Error en login:", error);
      callback({ success: false, message: "Error en login" });
    }
  });


  // -------------------
  // Negocio
  // -------------------
  // Esto esta en el RegistroEmpresa.vue
  socket.on("crear_negocio", async (data, callback) => {
    console.log("Datos para comprobar: ",data)
    try {
      // Validación mínima (opcional pero recomendable)
      if (!data.username || !data.departamento || !data.ciudad) {
        return callback({
          success: false,
          message: "Faltan campos obligatorios"
        });
      }

      // Crear una instancia del modelo con los datos recibidos y el usuario del socket
      const nuevoNegocio = new Negocio({
        Nombre_N: data.username,
        url_i: data.url_imagen || '', // Por si no envían imagen
        Departamento: data.departamento,
        Ciudad: data.ciudad,
        usuario: data.usuario      // Referencia al usuario autenticado
      });

      // Guardar en la base de datos
      await nuevoNegocio.save();

      // Responder al cliente
      callback({
        success: true,
        negocioId: nuevoNegocio._id
      });

    } catch (error) {
      console.error("Error al crear negocio:", error);
      callback({
        success: false,
        message: "Error al crear negocio"
      });
    }
  });
  // Muestra en el menu principal las empresas que tenemos en la BD
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
  // Card - Menu de empresa en el frontend
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
  socket.on("solicitar_cards", async (callback) => {
    try {
      const userId = socket.handshake.auth?.userId || null;

      if (!userId) {
        return callback({ error: "No autorizado" });
      }

      const negocios = await Negocio.find({ usuario: userId });
      console.log(negocios)
      callback({  
        cards: negocios.map(n => ({
          id: n._id,
          title: n.Nombre_N,
          imagenURL: n.url_i
        }))
      });

    } catch (err) {
      console.error("Error al obtener negocios:", err);
      callback({ error: "Error interno del servidor" });
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

  socket.on("obtener_servicios", async ({ negocioId }, callback) => {
    try {
      const negocio = await Negocio.findById(negocioId)
      if (!negocio) return callback({ success: false, message: "Negocio no encontrado" })

      callback({ success: true, servicios: negocio.servicios || [] })
    } catch (err) {
      console.error(err)
      callback({ success: false, message: "Error al obtener servicios" })
    }
  })

  // Editar card en menu de empresa
  // boolean que cambie la visibilidad del negocio mientras lo estan modificando 


  // -------------------
  // Tabla de usuario del negocio / historial de servicios del usuario
  // -------------------
  

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

  socket.on("agregar_servicio", async (data, callback) => {
  try {
    const { negocioId, servicio } = data;

    if (!negocioId || !servicio || !servicio.titulo || !servicio.precio) {
      return callback({ success: false, message: "Datos incompletos" });
    }

    // Buscar el negocio
    const negocio = await Negocio.findById(negocioId);
    if (!negocio) {
      return callback({ success: false, message: "Negocio no encontrado" });
    }

    // Inicializar el array si no existe
    if (!Array.isArray(negocio.servicios)) {
      negocio.servicios = [];
    }

    // Agregar el servicio
    negocio.servicios.push(servicio);

    // Guardar los cambios
    await negocio.save();

    callback({ success: true, servicios: negocio.servicios });
  } catch (err) {
    console.error("Error al agregar servicio:", err);
    callback({ success: false, message: "Error del servidor" });
  }
});

});

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