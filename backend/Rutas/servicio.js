// Rutas/servicio.js
import express from "express";
import Servicio from "../Sockets/servicio.js"; // recuerda, tus modelos viven en /Sockets

const router = express.Router();

// 📌 Crear servicio
router.post("/servicios", async (req, res) => {
  try {
    const { Nombre_S, Descripcion, Precio, Contacto_S, ID_N } = req.body;

    const nuevoServicio = new Servicio({
      Nombre_S,
      Descripcion,
      Precio,
      Contacto_S,
      ID_N,
    });

    await nuevoServicio.save();

    res.json({ success: true, message: "Servicio creado con éxito", servicio: nuevoServicio });
  } catch (error) {
    console.error("Error en POST /servicios:", error);
    res.status(500).json({ success: false, message: "Error al crear servicio" });
  }
});

// 📌 Listar todos los servicios
router.get("/servicios", async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json({ success: true, servicios });
  } catch (error) {
    console.error("Error en GET /servicios:", error);
    res.status(500).json({ success: false, message: "Error al obtener servicios" });
  }
});

// 📌 Listar servicios de un negocio por ID_N
router.get("/servicios/negocio/:idNegocio", async (req, res) => {
  try {
    const { idNegocio } = req.params;
    const servicios = await Servicio.find({ ID_N: idNegocio });
    res.json({ success: true, servicios });
  } catch (error) {
    console.error("Error en GET /servicios/negocio/:idNegocio:", error);
    res.status(500).json({ success: false, message: "Error al obtener servicios del negocio" });
  }
});

// 📌 Eliminar servicio por ID
router.delete("/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const servicioEliminado = await Servicio.findByIdAndDelete(id);

    if (!servicioEliminado) {
      return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    }

    res.json({ success: true, message: "Servicio eliminado con éxito" });
  } catch (error) {
    console.error("Error en DELETE /servicios/:id:", error);
    res.status(500).json({ success: false, message: "Error al eliminar servicio" });
  }
});

export default router;
