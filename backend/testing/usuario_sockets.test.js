import { Server } from "socket.io";
import Client from "socket.io-client";
import mongoose from "mongoose";
import Usuario from "../models/usuario.js";
import { initDB } from "../initDB.js";
import registerSocketHandlers from "../Sockets/index_S.js";
import { generateToken } from "../JWT/generateToken.js";


let io, serverSocket, clientSocket;
const SOCKET_PORT = 4500;

beforeAll(async () => {
  // Conectar a BD (usa una base temporal)
  await mongoose.connect("mongodb://127.0.0.1:27017/test_sockets", {
    dbName: "test_sockets",
  });
  await Usuario.deleteMany({}); // Limpiar colección

  // Iniciar servidor Socket.IO
  io = new Server(SOCKET_PORT, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    serverSocket = socket;
    registerSocketHandlers(socket);
  });
});

afterAll(async () => {
  if (io) io.close();
  if (clientSocket && clientSocket.connected) clientSocket.close();
  await mongoose.connection.close();
});

function createClient(auth = {}) {
  return new Client(`http://localhost:${SOCKET_PORT}`, { auth });
}

test("📥 registrar: debería crear un usuario nuevo", (done) => {
  clientSocket = createClient();

  clientSocket.on("connect", () => {
    clientSocket.emit(
      "registrar",
      { username: "gaston", password: "secreto123" },
      async (res) => {
        try {
          expect(res.success).toBe(true);
          expect(res.user.nombre).toBe("gaston");
          const userInDB = await Usuario.findOne({ Nombre_U: "gaston" });
          expect(userInDB).not.toBeNull();
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});

test("🔑 login: debería devolver un token válido", (done) => {
  clientSocket = createClient();

  clientSocket.on("connect", () => {
    clientSocket.emit(
      "login",
      { username: "gaston", password: "secreto123" },
      (res) => {
        try {
          expect(res.success).toBe(true);
          expect(res.token).toBeDefined();
          expect(res.user.nombre).toBe("gaston");
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});

test("🏢 RegistroEmpresa: debería actualizar el usuario", (done) => {
  clientSocket = createClient();

  clientSocket.on("connect", async () => {
    // Obtener usuario y generar token manualmente
    const user = await Usuario.findOne({ Nombre_U: "gaston" });
    const token = generateToken({ id: user._id, nombre: user.Nombre_U });
    clientSocket.emit("RegistroEmpresa", { token }, async (res) => {
    expect(res.success).toBe(true);
    expect(res.usuario.Tipo_empresa).toBe(true);
    const updatedUser = await Usuario.findById(user._id);
    expect(updatedUser.Tipo_empresa).toBe(true);
    done();
    });
  });
});
