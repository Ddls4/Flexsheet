import express from "express";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { registrar, login, createCard, getCardsByUser, guardarTabla, cargarTabla, eliminarCard } from "./Base_de_datos/Mongo.js";

config(); // Cargar variables del .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS ---
app.use(cors({
  origin: ["http://localhost:9000", "http://127.0.0.1:5500"], // tu frontend
  credentials: true
}));

// --- SESIÓN ---
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecreto123",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 86400000, sameSite: 'lax' }
});
app.use(sessionMiddleware);

// --- RUTAS HTTP ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await login(username, password);
    req.session.userId = user._id;
    req.session.save(err => {
      if (err) return res.status(500).json({ success: false, message: "Error de sesión" });
      res.json({ success: true, user: { id: user._id, username: user.username } });
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// --- SERVIDOR HTTP + SOCKET.IO ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:9000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
io.use((socket, next) => { socket.session = socket.request.session; next(); });

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on("registrar", async ({ username, password }, callback) => {
    try {
      const userId = await registrar(username, password);
      callback({ success: true, message: "Usuario registrado" });
    } catch {
      callback({ success: false, message: "Error al registrar" });
    }
  });

  socket.on("create_card", async ({ title, date, imagenURL }, callback) => {
    if (!socket.session.userId) return callback({ success: false, message: 'No autenticado' });
    try {
      const cardId = await createCard(socket.session.userId, title, date, imagenURL);
      callback({ success: true, cardId, message: 'Card creada' });
    } catch (error) {
      callback({ success: false, message: error.message });
    }
  });

  socket.on("delete_card", async ({ id }, callback) => {
    try {
      await eliminarCard(id);
      callback({ success: true });
    } catch (err) {
      callback({ success: false, error: err.message });
    }
  });

  socket.on("solicitar_cards", async (callback) => {
    if (!socket.session.userId) return callback({ error: "No autorizado" });
    try {
      const cards = await getCardsByUser(socket.session.userId);
      callback({ cards });
    } catch {
      callback({ error: "Error del servidor" });
    }
  });

  socket.on("guardar_tabla", async ({ card_id, columns, rows }, callback) => {
    try {
      await guardarTabla({ card_id, columns, rows });
      callback({ success: true });
    } catch (error) {
      callback({ success: false, message: error.message });
    }
  });

  socket.on("solicitar_tabla", async ({ title, id }, callback) => {
    if (!socket.session.userId) return callback({ success: false, message: "No autorizado" });
    try {
      const datos = await cargarTabla(title, id);
      callback({ success: true, ...datos });
    } catch (err) {
      callback({ success: false, message: err.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// --- LEVANTAR SERVIDOR ---
const PORT = process.env.PORT || 9000;
const HOST = process.env.P_IP || "localhost";

httpServer.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
  console.log(`WebSocket disponible en ws://${HOST}:${PORT}`);
});
