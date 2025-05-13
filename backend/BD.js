import mysql from "mysql2"
import {} from "dotenv"

const conexion = await mysql.createConnection({
    host: process.env.S_IP,
    user: process.env.S_USER,
    database: process.env.S_DB,
    password: process.env.S_CEN
});

conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

const registrar = async (username) => {
    console.log("Registrando a ", username);
    const query = "INSERT INTO `usuario` (`nombre`) VALUES (?)";
    
    conexion.query(query, [username], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return console.log('El usuario ya existe');
            }
            return console.log('Error al registrar el usuario:', err);
        }
        console.log({ message: 'Usuario registrado exitosamente' });
    });
};

export {
    registrar
}