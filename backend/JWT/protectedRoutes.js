// Por ahora sin uso, pero se deja para futuras rutas protegidas
import express from "express";
import { verifyJWT } from "./authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyJWT, (req, res) => {
  res.json({
    message: `Bienvenido ${req.user.nombre}`,
    user: req.user,
  });
});

export default router;
