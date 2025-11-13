// src/socket.js
import { io } from "socket.io-client";

// URL del backend
const BACKEND_URL = "http://localhost:3000"; // mismo puerto que tu backend

export const socket = io(BACKEND_URL, {
  transports: ["websocket", "polling"],
});

// Ejemplo de eventos
socket.on("connect", () => {
  console.log("🟢 Conectado al backend, ID:", socket.id);
});

socket.on("respuesta", (msg) => {
  console.log("💬 Mensaje del backend:", msg);
});

socket.on("payment_update", (data) => {
  console.log("💸 Actualización de pago:", data);
});
