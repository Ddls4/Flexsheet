import { Server } from "socket.io";
import Client from "socket.io-client";
import { verifySocketJWT } from "../JWT/authMiddleware.js";
import { generateToken } from "../JWT/generateToken.js";

let io, serverSocket, clientSocket;

beforeAll((done) => {
  io = new Server(4000, {
    cors: { origin: "*" },
  });

  io.use(verifySocketJWT);

  io.on("connection", (socket) => {
    serverSocket = socket;

    // 🔹 Emitir después de un microdelay para asegurar que el cliente ya esté escuchando
    setTimeout(() => {
      socket.emit("welcome", { user: socket.user || null });
    }, 100);
  });

  clientSocket = new Client("http://localhost:4000", {
    auth: { token: generateToken({ id: "1", nombre: "Pepe" }) },
  });

  clientSocket.on("connect", done);
});

afterAll(async () => {
  if (clientSocket && clientSocket.connected) {
    clientSocket.disconnect();
  }
  if (io) {
    await new Promise((resolve) => io.close(resolve));
  }
});

test("Debe autenticar correctamente un socket con JWT válido", (done) => {
  clientSocket.once("welcome", (data) => {
    try {
      expect(data.user.nombre).toBe("Pepe");
      done();
    } catch (err) {
      done(err);
    }
  });
}, 10000); // ⏱️ tiempo máximo extendido a 10s

test("Debe permitir conexión sin token", (done) => {
  const socketNoAuth = new Client("http://localhost:4000", {
    auth: {},
  });

  socketNoAuth.on("connect", () => {
    socketNoAuth.once("welcome", (data) => {
      try {
        expect(data.user).toBeNull();
        socketNoAuth.disconnect();
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
