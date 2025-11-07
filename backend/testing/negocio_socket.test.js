// testing/negocio_socket.test.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import Negocio from "../models/negocio.js";
import negocioSockets from "../Sockets/negocio_S.js";

let io, serverSocket, clientSocket, mongoServer;
let testUserId;

beforeAll(async () => {
  // Iniciar MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Crear servidor Socket.IO
  const httpServer = createServer();
  io = new Server(httpServer);

  io.on("connection", (socket) => {
    // Simulamos un usuario autenticado con un ObjectId válido
    testUserId = new mongoose.Types.ObjectId();
    socket.user = { id: testUserId.toString(), nombre: "TestUser" };
    negocioSockets(socket);
    serverSocket = socket;
  });

  await new Promise((resolve) => {
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on("connect", resolve);
    });
  });
}, 20000);

afterAll(async () => {
  io.close();
  if (clientSocket) clientSocket.close();
  await mongoose.disconnect();
  await mongoServer.stop();
}, 10000);

beforeEach(async () => {
  await Negocio.deleteMany({});
}, 10000);

// -------------------------
// TESTS DE NEGOCIOS
// -------------------------

test("crear negocio", (done) => {
  const negocioData = {
    Nombre_N: "Negocio Test",
    departamento: "Depto1",
    ciudad: "Ciudad1",
    url_i: "url-imagen",
  };

  clientSocket.emit("crear_negocio", negocioData, (response) => {
    try {
      expect(response.success).toBe(true);
      expect(response.negocioId).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
});

test("editar negocio", (done) => {
  const negocio = new Negocio({
    Nombre_N: "Negocio Original",
    Departamento: "Depto1",
    Ciudad: "Ciudad1",
    usuario: testUserId,
  });

  negocio.save().then(() => {
    clientSocket.emit(
      "editar_negocio",
      { negocioId: negocio._id, Nombre_N: "Negocio Editado" },
      (response) => {
        try {
          expect(response.success).toBe(true);
          expect(response.negocio.Nombre_N).toBe("Negocio Editado");
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});

test("eliminar negocio", (done) => {
  const negocio = new Negocio({
    Nombre_N: "Negocio A Eliminar",
    Departamento: "Depto1",
    Ciudad: "Ciudad1",
    usuario: testUserId,
  });

  negocio.save().then(() => {
    clientSocket.emit(
      "eliminar_negocio",
      { negocioId: negocio._id },
      (response) => {
        try {
          expect(response.success).toBe(true);
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});

// -------------------------
// TESTS DE SERVICIOS
// -------------------------

test("agregar servicio a negocio", (done) => {
  const negocio = new Negocio({
    Nombre_N: "Negocio con Servicios",
    Departamento: "Depto1",
    Ciudad: "Ciudad1",
    usuario: testUserId,
  });

  negocio.save().then(() => {
    const servicio = { titulo: "Corte de Pelo", precio: 100 };
    clientSocket.emit(
      "agregar_servicio",
      { negocioId: negocio._id, servicio },
      (response) => {
        try {
          expect(response.success).toBe(true);
          expect(response.servicios.length).toBe(1);
          expect(response.servicios[0].titulo).toBe("Corte de Pelo");
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});

test("obtener servicios de negocio público", (done) => {
  const negocio = new Negocio({
    Nombre_N: "Negocio Público",
    Departamento: "Depto1",
    Ciudad: "Ciudad1",
    publico: true,
    servicios: [{ titulo: "Servicio Público", precio: 50 }],
    usuario: testUserId,
  });

  negocio.save().then(() => {
    clientSocket.emit(
      "obtener_servicios",
      { negocioId: negocio._id },
      (response) => {
        try {
          expect(response.success).toBe(true);
          expect(response.servicios.length).toBe(1);
          expect(response.servicios[0].titulo).toBe("Servicio Público");
          done();
        } catch (err) {
          done(err);
        }
      }
    );
  });
});
