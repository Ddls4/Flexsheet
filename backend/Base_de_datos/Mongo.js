import { MongoClient } from "mongodb"; 
import {} from "dotenv";
import bcrypt from "bcrypt";


// URL de conexión y base de datos
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "pruebadb";
const db = client.db(dbName);
const collection = db.collection("usuarios");
const conectarMongo = async () => {
    await client.connect();
    console.log("Conectado a MongoDB");
    return client.db(dbName);  // Retorna la base de datos
}

const registrar = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);  // Encriptamos la contraseña

    try {
        const db = await conectarMongo();  // Conectamos a la base de datos
        const usersCollection = db.collection('usuarios');  // Obtenemos la colección 'usuarios'

        // Verificamos si el usuario ya existe en la base de datos
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            console.log("El usuario ya existe");
            return;  // Salimos si el usuario ya está registrado
        }

        // Insertamos el nuevo usuario con la contraseña encriptada
        const result = await usersCollection.insertOne({
            username,
            password: hashedPassword,
        });

        console.log("Usuario registrado:", username, "ID:", result.insertedId);  // Mostramos el ID del nuevo usuario
    } catch (err) {
        console.error("Error al registrar:", err);
        throw err;  // Lanza el error si ocurre algún problema
    }
};

const login = async (username, password) => {
  try {
    const db = await conectarMongo();
    const usersCollection = db.collection('usuarios');

    // Buscar al usuario en la base de datos
    const user = await usersCollection.findOne({ username });
    console.log("Login exitoso para:", user);
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Comparar la contraseña proporcionada con la encriptada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    return user;
  } catch (err) {
    console.error("Error en el login:", err);
    throw err;
  }
};

const createCard = async (userId, title, date, imagenURL) => {
  console.log(userId, title, date, imagenURL);  // Imprime los parámetros recibidos

  try {
    const db = await conectarMongo();  // Conectamos a la base de datos
    const cardsCollection = db.collection("cards");  // Obtenemos la colección "cards"

    // Insertar el nuevo documento (tarjeta) en la colección
    const result = await cardsCollection.insertOne({
      userId,
      title,
      date,
      imagenURL,
    });

    console.log("Tarjeta creada con ID:", result.insertedId);  // Mostramos el ID de la tarjeta creada
    return result.insertedId;  // Retorna el ID del nuevo documento insertado
  } catch (err) {
    console.error("Error al crear la tarjeta:", err);
    throw err;  // Lanza el error en caso de fallo
  }
};

const getCardsByUser = async (userId) => {
  try {
    const db = await conectarMongo();
    const cardsCollection = db.collection('cards');  // Obtener la colección 'cards'

    // Buscar las tarjetas que pertenecen al userId
    const cards = await cardsCollection.find({ userId }).toArray();

    return cards;  // Retorna todas las tarjetas encontradas
  } catch (err) {
    console.error("Error al obtener las tarjetas del usuario:", err);
    throw err;  // Lanza el error si ocurre un fallo
  }
};

const guardarTabla = async ({ card_id, columns, rows }) => {
  if (!card_id || !Array.isArray(rows) || !Array.isArray(columns)) {
    throw new Error("Datos incompletos");
  }

  // Convertimos las columnas y filas a JSON
  const datosJSON = JSON.stringify({ columns, rows });

  try {
    const db = await conectarMongo();
    const tablaCollection = db.collection("tabla");

    // Intentamos insertar un nuevo documento o actualizar si ya existe
    const result = await tablaCollection.updateOne(
      { card_id },  // Filtro para encontrar el documento
      {
        $set: { datos: datosJSON, fecha_guardado: new Date() },  // Actualiza los datos y la fecha
      },
      { upsert: true }  // Si no existe, inserta un nuevo documento
    );

    console.log("Documento guardado o actualizado con éxito");
    return result;  // Retorna el resultado de la operación
  } catch (err) {
    console.error("Error al guardar los datos:", err);
    throw err;  // Lanza el error si ocurre algún fallo
  }
};

const cargarTabla = async (title, id = null) => {
  if (!title && !id) {
    throw new Error("Título o ID requerido");
  }

  let cards_id;

  // Si el ID es proporcionado directamente
  if (id) {
    cards_id = id;
  } else {
    // Si no se proporciona el ID, buscamos el card por el título
    const db = await conectarMongo();
    const cardsCollection = db.collection("cards");

    // Buscar el card por título
    const cardResult = await cardsCollection.findOne({ title });
    if (!cardResult) {
      throw new Error("Card no encontrada");
    }
    console.log(cardResult);  // Muestra los resultados de la búsqueda del card

    // Asignar el ID del card encontrado
    cards_id = cardResult._id;  // MongoDB usa _id como campo por defecto
  }

  // Ahora buscamos la tabla asociada con el card_id
  const db = await conectarMongo();
  const tablaCollection = db.collection("tabla");

  // Buscar la tabla por card_id
  const tablaResult = await tablaCollection.findOne({ cards_id });
  if (!tablaResult) {
    return { columns: [], rows: [] };  // Si no se encuentra la tabla, retornamos tabla vacía
  }

  console.log(tablaResult);  // Muestra los resultados de la tabla

  // Parsear los datos JSON que están almacenados en el campo "datos"
  const datos = JSON.parse(tablaResult.datos);
  console.log(datos);

  return datos;  // Retornamos los datos de la tabla
};

const eliminarCard = async (id) => {
if (!id) {
    throw new Error('Falta el ID de la card');
  }
  const [result] = await conexion.query('DELETE FROM cards WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('Card no encontrada');
  }
  return true;
}


/*const usuarios=async(usuario) => {
    const result = await collection.insertOne(usuario);
    return result.insertedId;
} */

export { 
    registrar,
    login,
    createCard,
    getCardsByUser,
    guardarTabla,
    cargarTabla,
    eliminarCard
};