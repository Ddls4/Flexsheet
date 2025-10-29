import { MongoClient } from "mongodb";

// URL de conexión local
const uri = "mongodb://localhost:27017";

// Nombre de la base de datos
const dbName = "test";

async function run() {
  const client = new MongoClient(uri);

  try {
    // Conectar al servidor
    await client.connect();
    console.log("Conectado a MongoDB correctamente");

    const db = client.db(dbName);
    const collection = db.collection("usuarios");

    // Insertar un documento
    await collection.insertOne({ nombre: "Gaston", fecha: new Date() });
    console.log("Documento insertado");

    // Leer documentos
    const docs = await collection.find({}).toArray();
    console.log("Documentos en la colección:", docs);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Cerrar conexión
    await client.close();
  }
}

run();
