import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "passport";
import jwt from "jsonwebtoken";
import "./config/passport.js"; // importa la config passport
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { verifySocketJWT } from "./middleware/authMiddleware.js";
import "./config/db.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    credentials: true,
  },
});

// --- Middlewares ---
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/dist/spa")));

app.use(
  cors({
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    credentials: true,
  })
);

// --- Passport inicializado ---
app.use(passport.initialize());

// --- Rutas ---
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

// --- Socket.IO con JWT ---
io.use(verifySocketJWT); // usa middleware JWT
io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.user?.nombre || "anónimo");

  socket.on("mensaje", (data) => {
    console.log(`Mensaje de ${socket.user.nombre}:`, data);
  });
});

// --- Iniciar servidor ---
httpServer.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Servidor HTTP en http://${process.env.P_IP}:${process.env.PORT}`);
  console.log(`WebSocket activo en ws://${process.env.P_IP}:${process.env.PORT}`);
});
