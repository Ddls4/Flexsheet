import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Usuario.findOne({ Nombre_U: username });
    if (existingUser)
      return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Usuario.create({
      Nombre_U: username,
      Contraseña: hashedPassword,
    });

    res.json({ success: true, message: "Usuario registrado", user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

// Login usuario
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      return res.status(400).json({ success: false, message: info?.message || "Error" });

    const token = jwt.sign(
      { id: user._id, nombre: user.Nombre_U },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, nombre: user.Nombre_U },
    });
  })(req, res, next);
});

// Verificar token
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    res.json({ valid: true, user: decoded });
  });
});

export default router;
