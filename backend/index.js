import { servidor,io  } from "./config.js";
import { registrar, login, createCard, getCardsByUser, guardarTabla, cargarTabla, eliminarCard, conexion } from "./BD.js";

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

  socket.on("solicitar_cards", async () => {
    const userId = socket.request.session.userId;
    if (!userId) {
      return socket.emit("error_cards", { error: "No autorizado" });
    }
    try {
      const cards = await getCardsByUser(userId);
      socket.emit("cards_usuario", { cards });
    } catch (error) {
      console.error("Error al obtener las cards:", error);
      socket.emit("error_cards", { error: "Error del servidor" });
    }
  });

  socket.on("solicitar_tabla", async ({ title, id }) => {
    console.log(`Socket solicita /tabla con title=${title} e id=${id}`);
    
    try {
      const datos = await cargarTabla(title, id);
      socket.emit("tabla_recibida", datos);
    } catch (err) {
      console.error("Error al consultar la tabla:", err.message);
      socket.emit("tabla_error", {
        message: err.message || "Error del servidor"
      });
    }
  });

});

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// usuario
servidor.get("/user", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }
    try {
        const query = 'SELECT id, Nombre FROM usuarios WHERE id = ?';
        conexion.query(query, [req.session.userId], (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
            res.status(200).json({ success: true, user: results[0] });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
    }
});

servidor.post("/register", async (req, res) => {
    const { username, password }  = req.body;
    console.log("El usuario en registro es: ",username)
    try {
      await registrar(username, password);
      res.status(200).json({ success: true, message: "Usuario registrado" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al registrar" });
    }
});
servidor.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await login(username, password);
        req.session.userId = user.id;
        res.status(200).json({ 
            success: true, 
            message: 'Inicio de sesión exitoso',
            user: { id: user.id, username: user.Nombre } // Devolver datos del usuario
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// cards
servidor.post('/cards', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
    }
    try {
        const { title, date, imagenURL } = req.body;
        const cardId = await createCard(req.session.userId, title, date, imagenURL);
        res.status(201).json({ 
            success: true, 
            cardId,
            message: 'Card creada exitosamente'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error al crear la card',
            error: error.message
        });
    }
});

servidor.post('/cardEliminar', async (req, res) => {
  const { id } = req.body;
  try {
    await eliminarCard(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando la card:', err.message);
    if (err.message === 'Falta el ID de la card') {
      res.status(400).json({ error: err.message });
    } else if (err.message === 'Card no encontrada') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});
// tabla 
servidor.post('/guardar-tabla', async (req, res) => {
    console.log("Guardando tabla");
    const { card_id, columns, rows } = req.body;
    try {
        await guardarTabla({ card_id, columns, rows });
        res.json({ success: true, message: 'Datos guardados correctamente' });
    } catch (error) {
        console.error('Error al guardar en la base de datos:', error.message);
        const status = error.message === 'Datos incompletos' ? 400 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
});
