import { servidor,io  } from "./config.js";
import { registrar } from "./BD.js"

servidor.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));

   io.emit("comprar_peliculas",{
       peliculas:[{nombre:"pelicula1"}] 
    })

  });
  
servidor.post("/register", async (req, res) => {
    const { name } = req.body;
    console.log("El usuario en registro es: ",name)
    registrar( name );
});

  