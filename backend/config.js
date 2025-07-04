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

// Middlewares | Configuración del servidor
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.static(path.join(__dirname, '../frontend/dist/spa')));
servidor.use((req, res, next) => {
    req.setTimeout(30000);  // 30 segundos para recibir la petición
    res.setTimeout(30000);  // 30 segundos para enviar la respuesta
    next();
});

servidor.use(cors({
  origin: `http://${process.env.P_IP}:${process.env.PORT_W}`,
  credentials: true
}));

servidor.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// Configurar Socket.IO en el servidor HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

// Manejar conexiones WebSocket
io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});


// Iniciar servidor
httpServer.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://${process.env.P_IP}:${process.env.PORT}`);
  console.log(`WebSocket disponible en ws: http://${process.env.P_IP}:${process.env.PORT_W}`);
})



export{
    servidor,
    io
}