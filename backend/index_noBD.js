import { servidor,io  } from "./config.js";
import mongoose from 'mongoose';

// 1. Conexión a la base de datos "ddfjg"
mongoose.connect('mongodb://127.0.0.1:27017/ddfjg')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error en MongoDB:', err));

// 2. Definir el esquema y modelo de Usuario
const usuarioSchema = new mongoose.Schema({
  Nombre_U: String,
  Correo_electronico: String,
  Contraseña: String,
  ID_U: String
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// 3. Insertar un usuario de prueba cuando la conexión esté abierta
mongoose.connection.once('open', async () => {
  console.log('Conexión abierta, insertando usuario de prueba...');

  try {
    const nuevoUsuario = new Usuario({
      Nombre_U: 'Gastón',
      Correo_electronico: 'gaston@example.com',
      Contraseña: '123456',
      ID_U: 'u001'
    });

    await nuevoUsuario.save();
    console.log('Usuario insertado con éxito');
  } catch (error) {
    console.error('Error insertando usuario:', error);
  } finally {
    mongoose.connection.close(); // cerrar conexión cuando terminás
  }
});

//rutas con socket.io y elmongoso // 
socket.on('registrar', async (data) => {
    try {
      const nuevoUsuario = new Usuario(data);
      await nuevoUsuario.save();
      socket.emit('registrar', { success: true, message: 'Usuario registrado' });
    } catch (error) {
      console.error(error);
      socket.emit('registrar', { success: false, message: 'Error al registrar' });
     }});

servidor.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connect", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

});

/* 
  Probamos las rutas
Rutas

connect = muestra que estas conectado al backend  
disconnect = muestra que no estas conectado al backend
get_user = sirve para que el frontend y el backend sepan que usuario esta activo 
registrar = información del usuario para que llegue a la base de datos y lo registre
login = pedida de datos del usuario desde la base de datos
nueva_empresa = ruta para agregar una nueva empresa a la base de datos
nuevo_servicio = ruta para agregar una nuevo servicio a la base de datos
delete_empresa = elimina la empresa de la base de datos
delete_servicio = elimina el servicio de la base de datos
solicitar_empresas = en el main tiene que traer todas las empresas
solicitar_empresa = tiene que mostrarte tus empresa
solicitar_servicios = tiene que mostrar todos los servicios
solicitar_tabla = "carga la table de datos de los usuarios que solicitaron servicio"


*/