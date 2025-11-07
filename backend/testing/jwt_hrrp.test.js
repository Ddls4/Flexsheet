// jwt-hrrp
import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import { verifyJWT } from "../JWT/authMiddleware.js"; // <-- tu ruta real
import { generateToken } from "../JWT/generateToken.js";  // <-- tu ruta real

// Clave usada en los tests (asegúrate de que coincida con la de tu código)
const SECRET_KEY = process.env.JWT_SECRET || "tu_clave_super_secreta_muy_larga_y_compleja";

describe("🔐 Testing JWT middlewares y generación", () => {
  test("Debe generar un token válido", () => {
    const user = { id: "123", nombre: "Juan" };
    const token = generateToken(user);

    const decoded = jwt.verify(token, SECRET_KEY);

    expect(decoded.nombre).toBe("Juan");
    expect(decoded.id).toBe("123");
  });

  test("Debe rechazar peticiones sin token", async () => {
    const app = express();
    app.get("/protegido", verifyJWT, (req, res) => res.json({ ok: true }));

    const res = await request(app).get("/protegido");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token requerido");
  });

  test("Debe aceptar peticiones con token válido", async () => {
    const app = express();
    app.get("/protegido", verifyJWT, (req, res) => res.json({ user: req.user }));

    const token = generateToken({ id: "123", nombre: "Juan" });
    const res = await request(app)
      .get("/protegido")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.nombre).toBe("Juan");
  });

  test("Debe rechazar peticiones con token inválido", async () => {
    const app = express();
    app.get("/protegido", verifyJWT, (req, res) => res.json({ ok: true }));

    const res = await request(app)
      .get("/protegido")
      .set("Authorization", "Bearer token_invalido");

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Token inválido");
  });
});