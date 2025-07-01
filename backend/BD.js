import mysql from "mysql2/promise";
import {} from "dotenv";
import bcrypt from "bcrypt";

const conexion = mysql.createPool({
  host: process.env.S_IP,
  user: process.env.S_USER,
  database: process.env.S_DB,
  password: process.env.S_CEN,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 60000
});

const registrar = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await conexion.query(
            'INSERT INTO usuarios (nombre, contraseña) VALUES (?, ?)',
            [username, hashedPassword]
        );
        console.log("Usuario registrado:", username);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.log("El usuario ya existe");
        } else {
            console.error("Error al registrar:", err);
        }
        throw err;
    }
};
const login = async (username, password) => {
    console.log(password, password)
    const [rows] = await conexion.query(
        'SELECT * FROM usuarios WHERE nombre = ?',
        [username]
    );

    if (rows.length === 0) throw new Error('Usuario o contraseña incorrectos');

    const user = rows[0];
    console.log(password, user.contraseña)
    const isMatch = await bcrypt.compare(password, user.contraseña);

    if (!isMatch) throw new Error('Usuario o contraseña incorrectos');

    return user;
};
const createCard = async (userId, title, date, imagenURL) => {
    console.log(userId, title, date, imagenURL)
    const [result] = await conexion.query(
        'INSERT INTO cards (user_id, title, date, imagenURL) VALUES (?, ?, ?, ?)',
        [userId, title, date, imagenURL]
    );
    return result.insertId;
};
const getCardsByUser = async (userId) => {
    const [rows] = await conexion.query(
        'SELECT * FROM cards WHERE user_id = ?',
        [userId]
    );
    return rows;
};

// falta pasar  /guardar-tabla | /tabla/:title | /cardEliminar
// raro /user y /logout 
const guardarTabla = async ({ card_id, columns, rows }) => {
    if (!card_id || !Array.isArray(rows) || !Array.isArray(columns)) {
        throw new Error('Datos incompletos');
    }

    const datosJSON = JSON.stringify({ columns, rows });

    const query = `
        INSERT INTO tabla (cards_id, datos, fecha_guardado)
        VALUES (?, ?, CURDATE())
        ON DUPLICATE KEY UPDATE datos = VALUES(datos), fecha_guardado = CURDATE()
    `;

    await conexion.query(query, [card_id, datosJSON]);
};
const cargarTabla = async (title, id = null) => {
    if (!title && !id) {
        throw new Error('Título o ID requerido');
    }

    let cards_id;

    if (id) {
        cards_id = id;
    } else {
        const [cardResult] = await conexion.query(
            'SELECT id FROM cards WHERE title = ?',
            [title]
        );

        if (cardResult.length === 0) {
            throw new Error('Card no encontrada');
        }

        console.log(cardResult);  // <-- Aquí sí

        cards_id = cardResult[0].id;
    }

    const [tablaResult] = await conexion.query(
        'SELECT datos FROM tabla WHERE cards_id = ?',
        [cards_id]
    );

    if (tablaResult.length === 0) {
        return { columns: [], rows: [] }; // tabla vacía
    }

    console.log(tablaResult);

    const datos = JSON.parse(tablaResult[0].datos);
    console.log(datos);

    return datos;
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

export {
    registrar,
    login,
    createCard,
    getCardsByUser,
    guardarTabla,
    cargarTabla,
    eliminarCard,
    conexion
};