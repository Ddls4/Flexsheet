// index_S.js
import usuarioSockets from "./usuario_S.js";    
import negocioSockets from "./negocio_S.js";       
// import tablaSockets from "./tabla_S.js";    
     
export default function registerSocketHandlers(socket) {
  usuarioSockets(socket);
  negocioSockets(socket);
  //tablaSockets(socket);
}