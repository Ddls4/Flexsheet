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
    console.log(userId, title, date, imageUrl)
    const [result] = await conexion.query(
        'INSERT INTO cards (user_id, title, date, imagenURL) VALUES (?, ?, ?, ?)',
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
const save_table = (tableData, userId,req,res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Validación del formato del JSON
    if (!tableData || !tableData.columns || !tableData.rows) {
        return res.status(400).json({ message: 'Datos de la tabla no válidos' });
    }

    // Primero, verifica si el usuario ya tiene una tabla guardada
    const checkQuery = `SELECT id FROM Tabla WHERE user_id = ?`;

    conexion.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error al verificar la tabla existente:', err);
            return res.status(500).json({ message: 'Error al verificar la tabla existente' });
        }

        if (results.length > 0) {
            // Si ya existe, actualiza la tabla
            const updateQuery = `UPDATE Tabla SET datos = ? WHERE user_id = ?`;

            conexion.query(updateQuery, [JSON.stringify(tableData), userId], (err) => {
                if (err) {
                    console.error('Error al actualizar la tabla:', err);
                    return res.status(500).json({ message: 'Error al actualizar la tabla' });
                }

                res.json({ message: 'Tabla actualizada exitosamente' });
            });
        } else {
            // Si no existe, inserta una nueva entrada
            const insertQuery = `INSERT INTO Tabla (user_id, datos) VALUES (?, ?)`;

            conexion.query(insertQuery, [userId, JSON.stringify(tableData)], (err, results) => {
                if (err) {
                    console.error('Error al guardar en la base de datos:', err);
                    return res.status(500).json({ message: 'Error al guardar la tabla' });
                }

                res.json({ message: 'Tabla guardada exitosamente', id: results.insertId });
            });
        }
    });
}
const load_table =(userId, req, res) =>{
    if (!userId) {
        return res.status(400).json({ message: 'ID de usuario requerido' });
    }

    const query = `SELECT datos FROM Tabla WHERE user_id = ?`;

    conexion.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).json({ message: 'Error al cargar la tabla' });
        }

        if (results.length > 0) {
            const tableData = JSON.parse(results[0].datos); // Convertir el campo JSON a un objeto
            res.json(tableData); // Enviar la información al cliente
        } else {
            res.json(null); // No se encontraron datos
        }
    });
}
export {
    registrar,
    login,
    createCard,
    getCardsByUser,
    conexion
};