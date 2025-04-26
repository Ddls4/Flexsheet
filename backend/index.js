import { servidor,io  } from "./config.js";
// Ruta de prueba

servidor.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));

    io.emit("comprar_peliculas",{
       peliculas:[{nombre:"pelicula1"}] 
    })
  });
  