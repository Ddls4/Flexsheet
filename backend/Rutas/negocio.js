// rutas/negocio.js
import express from "express";
import Negocio from "../Sockets/negocio.js"; // recuerda que tus modelos están en /Sockets

const router = express.Router();

// Crear un negocio (equivalente a "nueva_empresa")
router.post("/", async (req, res) => {
  try {
    const nuevoNegocio = new Negocio(req.body);
    await nuevoNegocio.save();
    res.status(201).json({ success: true, negocio: nuevoNegocio });
  } catch (error) {
    console.error("Error al crear negocio:", error);
    res.status(500).json({ success: false, message: "Error al crear negocio" });
  }
});

// Listar todos los negocios (equivalente a "solicitar_empresas")
router.get("/", async (req, res) => {
  try {
    const negocios = await Negocio.find();
    res.json({ success: true, negocios });
  } catch (error) {
    console.error("Error al listar negocios:", error);
    res.status(500).json({ success: false, message: "Error al obtener negocios" });
  }
});

// Listar negocios de un usuario (equivalente a "solicitar_empresa")
router.get("/usuario/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const empresas = await Negocio.find({ ID_U: idUsuario });
    res.json({ success: true, empresas });
  } catch (error) {
    console.error("Error al obtener empresas del usuario:", error);
    res.status(500).json({ success: false, message: "Error al obtener empresas del usuario" });
  }
});

// Eliminar negocio por ID (equivalente a "delete_empresa")
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Negocio.findByIdAndDelete(id);
    res.json({ success: true, message: "Negocio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar negocio:", error);
    res.status(500).json({ success: false, message: "Error al eliminar negocio" });
  }
});

export default router;
