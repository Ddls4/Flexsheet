// config.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// JWT + Passport
import passport from "./JWT/passport.js";
import protectedRoutes from "./JWT/protectedRoutes.js";
import { verifySocketJWT } from "./JWT/authMiddleware.js";

config();

// ------------------------------
//   RUTAS DE ARCHIVOS
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------
//   EXPRESS
// ------------------------------
const servidor = express();
const httpServer = createServer(servidor);

// Seguridad
servidor.use(
  helmet({
    contentSecurityPolicy: false, // necesaria para evitar el error
    crossOriginEmbedderPolicy: false, 
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
servidor.use(helmet.noSniff());



servidor.use(
  cors({
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    credentials: true,
  })
);

// Middlewares
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.static(path.join(__dirname, '../frontend/dist/spa')));
servidor.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// ------------------------------
//   PASSPORT
// ------------------------------
servidor.use(passport.initialize());

// ------------------------------
//   RUTAS PROTEGIDAS
// ------------------------------
servidor.use("/api", protectedRoutes);

// ------------------------------
//   SOCKET.IO
// ------------------------------
const io = new Server(httpServer, {
  cors: {
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});
servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/spa/index.html"));
});
io.use(verifySocketJWT);
// ------------------------------
//   INICIAR SERVIDOR
// ------------------------------
httpServer.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(
    `Servidor API:       http://${process.env.P_IP}:${process.env.PORT}`
  );
  console.log(
    `WebSocket (JWT):    http://${process.env.P_IP}:${process.env.PORT}`
  );
  console.log(
    `Frontend Quasar:    http://${process.env.P_IP}:${process.env.PORT_W}`
  );
});

export { servidor, io };
