// /Rutas/usuarios.js
import express from "express";
import bcrypt from "bcrypt";
import Usuario from "../Sockets/usuario.js";

const router = express.Router();

// ----------------------------
// Crear / Registrar usuario
// POST /usuarios
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { Nombre_U, Contraseña } = req.body;

    // Verificar si ya existe el usuario
    const usuarioExistente = await Usuario.findOne({ Nombre_U });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: "El nombre de usuario ya está en uso" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(Contraseña, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      Nombre_U,
      Contraseña: hashedPassword
    });

    res.json({
      success: true,
      user: {
        _id: nuevoUsuario._id,
        Nombre_U: nuevoUsuario.Nombre_U
      }
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, message: "Error al registrar usuario" });
  }
});

// ----------------------------
// Login usuario
// POST /usuarios/login
// ----------------------------
router.post("/login", async (req, res) => {
  try {
    const { Nombre_U, Contraseña } = req.body;

    const user = await Usuario.findOne({ Nombre_U });
    if (!user) return res.status(400).json({ success: false, message: "Usuario no encontrado" });

    const match = await bcrypt.compare(Contraseña, user.Contraseña);
    if (!match) return res.status(400).json({ success: false, message: "Contraseña incorrecta" });

    res.json({
      success: true,
      user: {
        _id: user._id,
        Nombre_U: user.Nombre_U
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, message: "Error en login" });
  }
});

// ----------------------------
// Obtener info de usuario por ID
// GET /usuarios/:id
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await Usuario.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({
      success: true,
      user: {
        _id: user._id,
        Nombre_U: user.Nombre_U
      }
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ success: false, message: "Error al obtener usuario" });
  }
});

export default router;
