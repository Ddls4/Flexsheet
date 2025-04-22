import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const PORT = process.env.PORT || 3000;
// Obtener rutas del archivo y directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear servidor Express
const servidor = express();
// Middlewares
servidor.use(cors());
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

servidor.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});