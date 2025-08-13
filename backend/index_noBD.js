import express from "express";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = express();
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
    origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,  // *
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});
 io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
io.use((socket, next) => {
  // Guardar referencia de la sesión en el socket
  socket.session = socket.request.session;
  next();
});

// Iniciar servidor
httpServer.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${process.env.P_IP}:${process.env.PORT}`);
  console.log(`WebSocket disponible en ws: http://${process.env.P_IP}:${process.env.PORT_W}`); // login
})


servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

});