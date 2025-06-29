import { servidor,io  } from "./config.js";
import { registrar, login, createCard, getCardsByUser, conexion } from "./BD.js";

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

});
servidor.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));

   io.emit("comprar_peliculas",{
       peliculas:[{nombre:"pelicula1"}] 
    })

  });
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
servidor.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid'); // Asegúrate de que el nombre de la cookie coincida
        res.status(200).json({ success: true, message: 'Sesión cerrada' });
    });
});

// cards del usuario
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

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID de la card' });
  }

  try {
    const [result] = await conexion.query('DELETE FROM cards WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Card no encontrada' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error eliminando la card:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




// tabla 
servidor.post('/guardar-tabla', async (req, res) => {
    const { card_id, rows } = req.body;

    if (!card_id || !Array.isArray(rows)) {
        return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }

    try {
        const insertQuery = `
            INSERT INTO tabla (card_id, datos, fecha_guardado)
            VALUES (?, ?, CURDATE())
        `;

        for (const row of rows) {
            await conexion.query(insertQuery, [card_id, JSON.stringify(row)]);
        }

        res.json({ success: true, message: 'Datos guardados correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
    }
});