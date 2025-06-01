import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from "morgan";

// Obtener rutas del archivo y directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear servidor Express
const servidor = express();
config();
// Middlewares
servidor.use(cors());
servidor.use(morgan("dev"));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

servidor.use(express.static(path.join(__dirname, '../frontend/dist/spa')));

// Crear servidor HTTP
const httpServer = createServer(servidor);

servidor.use(cors({
  origin: 'http://localhost:9000', // o el puerto donde corre tu frontend
  credentials: true
}));

// Configurar Socket.IO en el servidor HTTP
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permitir conexiones desde cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
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

httpServer.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
  console.log(`WebSocket disponible en ws://localhost:${process.env.PORT}`);
})

export{
    servidor,
    io
}