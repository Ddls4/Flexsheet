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

const createCard = async (userId, title, date, imageUrl) => {
    const [result] = await conexion.query(
        'INSERT INTO cards (user_id, title, date, image_url) VALUES (?, ?, ?, ?)',
        [userId, title, date, imageUrl]
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

export {
    registrar,
    login,
    createCard,
    getCardsByUser,
    conexion
};