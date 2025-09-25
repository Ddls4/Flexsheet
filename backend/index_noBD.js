import { servidor,io  } from "./config.js";
import { conectarMongo, getDB, registrar } from "./Base_de_datos/Mongo.js";

// Conectar DB
conectarMongo()

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

  socket.on("get_user", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("registrar", async ({ username, password }, callback) => {
    try {
      await registrar(username, password);
      callback({ success: true, message: "Usuario registrado" });
    } catch (error) {
      callback({ success: false, message: "Error al registrar" });
    }
  });

  socket.on("login", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("nueva_empresa", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("nuevo_servicio", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("delete_empresa", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("delete_servicio", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("solicitar_empresas", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("solicitar_empresa", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("solicitar_servicios", async ({ title }, callback) => {
    console.log("Hola ..");
  });

  socket.on("solicitar_tabla", async ({ title }, callback) => {
    console.log("Hola ..");
  });

});

