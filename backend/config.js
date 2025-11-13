// config.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import passport from "./JWT/passport.js";
import protectedRoutes from "./JWT/protectedRoutes.js";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = express();
const httpServer = createServer(servidor);

// --- CORS ---
servidor.use(
  cors({
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    credentials: true,
  })
);

// --- Middlewares ---
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.static(path.join(__dirname, "../frontend/dist/spa")));

servidor.use(passport.initialize());

// --- Rutas protegidas ---
servidor.use("/api", protectedRoutes);

// --- HTTP principal ---
httpServer.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`🌐 Servidor HTTP en http://${process.env.P_IP}:${process.env.PORT}`);
});

// --- WebSocket en puerto separado ---
const io = new Server({
  cors: {
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.listen(process.env.PORT_W);
console.log(`🧩 WebSocket escuchando en ws://${process.env.P_IP}:${process.env.PORT_W}`);

export { servidor, io };
