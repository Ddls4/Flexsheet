import express from "express";  // Solo esta línea
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { registrar, login, createCard, getCardsByUser, guardarTabla, cargarTabla, eliminarCard } from "./Base_de_datos/Mongo.js";  // Asegúrate de que el archivo Mongo.js esté bien importado

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = express();  // Aquí creas la instancia de express
const httpServer = createServer(servidor);
config();

servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.static(path.join(__dirname, '../frontend/dist/spa')));
servidor.use((req, res, next) => {
    req.setTimeout(30000);
    res.setTimeout(30000); 
    next();
});

servidor.use(cors({
  origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
  credentials: true
}));

const sessionMiddleware = session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000, sameSite: 'lax' } 
});
servidor.use(sessionMiddleware);

const io = new Server(httpServer, {
  cors: {
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
io.use((socket, next) => {
  socket.session = socket.request.session;
  next();
});

// Iniciar servidor
httpServer.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${process.env.P_IP}:${process.env.PORT}`);
  console.log(`WebSocket disponible en ws: http://${process.env.P_IP}:${process.env.PORT_W}`);
});

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
  // Eventos de usuario
  socket.on("get_user", async (callback) => {
    if (!socket.request.session.userId) {
        return callback({ success: false, message: 'Usuario no autenticado' });
    }

    try {
        const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const usersCollection = db.db("nombreDeTuBaseDeDatos").collection("usuarios");

        const user = await usersCollection.findOne({ _id: socket.request.session.userId });

        if (!user) {
            return callback({ success: false, message: 'Usuario no encontrado' });
        }

        callback({ success: true, user: { id: user._id, Nombre: user.Nombre } });
    } catch (error) {
        console.error("Error al obtener el usuario desde MongoDB: ", error);
        callback({ success: false, message: 'Error al obtener los datos del usuario' });
    }
});
  socket.on("registrar", async ({ username, password }, callback) => {
    try {
      const userId = await registrar(username, password);
      callback({ success: true, message: "Usuario registrado" });
    } catch (error) {
      callback({ success: false, message: "Error al registrar" });
    }
  });
  servidor.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await login(username, password);
      
      // Guardar en sesión
      req.session.userId = user._id;
      console.log(req.session.userId )
      req.session.save(err => {
        if (err) {
          console.error("Error al guardar sesión:", err);
          return res.status(500).json({ success: false, message: "Error de servidor" });
        }
        
        console.log("Login exitoso para:", user._id);
        res.json({ 
          success: true,
          user: { id: user._id, username: user.username }
        });
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  // Eventos de cards
  socket.on("create_card", async ({ title, date, imagenURL }, callback) => {
    console.log("creando cards...")
    console.log(socket.request.session.userId)
    if (!socket.request.session.userId) {
      return callback({ success: false, message: 'No autenticado' });
    }
    try {
      const cardId = await createCard(socket.request.session.userId, title, date, imagenURL);
      callback({ 
        success: true, 
        cardId,
        message: 'Card creada exitosamente'
      });
    } catch (error) {
      callback({ 
        success: false, 
        message: 'Error al crear la card',
        error: error.message
      });
    }
  });
  socket.on("delete_card", async ({ id }, callback) => {
    try {
      await eliminarCard(id);
      callback({ success: true });
    } catch (err) {
      console.error('Error eliminando la card:', err.message);
      if (err.message === 'Falta el ID de la card') {
        callback({ success: false, error: err.message });
      } else if (err.message === 'Card no encontrada') {
        callback({ success: false, error: err.message });
      } else {
        callback({ success: false, error: 'Error interno del servidor' });
      }
    }
  });

  socket.on("solicitar_cards", async (callback) => {
    try {
      // Acceder a la sesión desde el socket
      if (!socket.session?.userId) {
        console.log("No autorizado - Sesión:", socket.session);
        return callback({ error: "No autorizado" });
      }
      
      const cards = await getCardsByUser(socket.session.userId);
      callback({ cards });
    } catch (error) {
      console.error("Error al obtener cards:", error);
      callback({ error: "Error del servidor" });
    }
  });

  socket.on("solicitar_tabla", async ({ title, id }, callback) => {
    try {
      // Verificar autenticación
      if (!socket.request.session?.userId) {
        console.log("Intento de acceso no autorizado - Sesión:", socket.request.session);
        if (typeof callback === 'function') {
          return callback({ 
            success: false, 
            message: "No autorizado" 
          });
        }
        return;
      }

      console.log(`Solicitando tabla: ${title}, ID: ${id} para usuario: ${socket.request.session.userId}`);
      
      // Obtener datos de la tabla
      const datos = await cargarTabla(title, id);
      console.log("Datos obtenidos:", datos);
      
      if (typeof callback === 'function') {
        callback({
          success: true,
          ...datos
        });
      }
    } catch (err) {
      console.error("Error al cargar tabla:", err);
      if (typeof callback === 'function') {
        callback({
          success: false,
          message: err.message || "Error del servidor"
        });
      }
    }
  });

  socket.on("guardar_tabla", async ({ card_id, columns, rows }, callback) => {
    console.log("Guardando tabla");
    try {
      await guardarTabla({ card_id, columns, rows });
      callback({ success: true, message: 'Datos guardados correctamente' });
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error.message);
      callback({ 
        success: false, 
        message: error.message 
      });
    }
  });


});
