// index.js
import path from "path";
import { servidor, io } from "./config.js"; // Servidor y Socket.io
import { initDB } from './initDB.js'; // BD
import registerSocketHandlers from "./Sockets/index_S.js";
// -------------------
// Inicializaciones
// -------------------
initDB();
// -------------------
// Socket.io
// -------------------
io.on("connection", (socket) => {
  console.log(`→ Usuario conectado: ${socket.user?.nombre}`);

  registerSocketHandlers(socket);

  socket.on("disconnect", () => {
    console.log(`← Usuario desconectado: ${socket.id}`);
  });
});
