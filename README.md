🛍️ AltaShop - Plataforma de Comercios y Servicios
Una aplicación full-stack moderna para conectar negocios locales con clientes, construida con Vue 3/Quasar y Node.js.

🚀 Características
🔐 Autenticación JWT - Segura con tokens y sockets

🏪 Gestión de Negocios - Crear, editar y administrar comercios

🛒 Carrito de Compras - Sistema de compras integrado

📱 Diseño Responsive - Adaptado a todos los dispositivos

⚡ Tiempo Real - Comunicación via WebSockets

🔒 Permisos Granulares - Control de acceso por usuario

🏗️ Arquitectura del Proyecto
Backend Structure

backend/
├── JWT/                    # Sistema de autenticación
│   ├── authMiddleware.js   # Middleware de verificación JWT
│   ├── authRoutes.js       # Rutas HTTP para auth (register/login)
│   ├── passport.js         # Configuración Passport.js
│   └── protectedRoutes.js  # Rutas protegidas
├── Sockets/                # Handlers de WebSockets
│   ├── index_S.js          # Registro central de handlers
│   ├── usuario_S.js        # Auth y gestión de usuarios
│   └── negocio_S.js        # Operaciones de negocios
├── models/                 # Modelos de MongoDB
│   ├── usuario.js          # Esquema de usuarios
│   └── negocio.js          # Esquema de negocios
├── config.js              # Configuración Express y Socket.io
├── index.js               # Punto de entrada del servidor
└── initDB.js              # Inicialización de base de datos
Frontend Structure

frontend/
├── src/
│   ├── layouts/
│   │   └── MainLayout.vue     # Layout principal con socket
│   ├── pages/
│   │   ├── IndexMenu.vue      # Catálogo público de negocios
│   │   ├── MenuEmpresa.vue    # Panel de control de negocios
│   │   ├── LoginUser.vue      # Inicio de sesión
│   │   └── RegistroUser.vue   # Registro de usuarios
│   └── boot/


📦 Instalación y Configuración
Prerrequisitos
Node.js 16+
MongoDB
npm o yarn

1. Backend Setup
cd backend
npm install

Configuración backend (.env):
PORT=80
PORT_W=9000
P_IP="192.168.1.100"  # Tu IP local
JWT_SECRET="tu_clave_super_secreta_muy_larga_y_compleja"
MONGODB_URI="mongodb+srv://******/:*******@cluster0.lwg6hol.mongodb.net/ddfjg?retryWrites=true&w=majority&appName=Cluster0"

Dependencias clave:

bash
# Autenticación
npm install passport passport-local jsonwebtoken bcrypt

# Servidor y BD
npm install express socket.io mongoose cors dotenv morgan

2. Frontend Setup
bash
cd frontend
npm install

Configuración (.env):
VITE_P_IP="192.168.1.100"  # Misma IP que el backend


Flujo JWT + Sockets
Registro/Login → Genera token JWT
Socket Connection → Conecta con token en handshake
Middleware → Verifica JWT en cada evento socket
Operaciones → Usa socket.user.id para permisos

🗄️ Modelos de Datos
Usuario
javascript
{
  Nombre_U: String,      // Nombre de usuario único
  Contraseña: String,    // Hash bcrypt
  Tipo_empresa: Boolean  // Rol de usuario
}
Negocio
javascript
{
  Nombre_N: String,      // Nombre del negocio
  url_i: String,         // URL de imagen
  Departamento: String,  // Ubicación
  Ciudad: String,        // Ubicación
  usuario: ObjectId,     // Dueño (referencia)
  publico: Boolean,      // Visibilidad
  servicios: [{
    titulo: String,
    descripcion: String, 
    precio: Number,
    imagenURL: String
  }]
}

🔌 API de Sockets
Autenticación
registrar - Crear nuevo usuario
login - Iniciar sesión
RegistroEmpresa - Convertir a cuenta empresa

Negocios
solicitar_cards - Obtener negocios del usuario
crear_negocio - Crear nuevo negocio
editar_negocio - Actualizar negocio
eliminar_negocio - Eliminar negocio
listar_negocios - Negocios públicos (catálogo)

Servicios
obtener_servicios - Servicios de un negocio
agregar_servicio - Añadir servicio
editar_servicio - Modificar servicio
eliminar_servicio - Eliminar servicio

Seguridad
JWT con expiración - Tokens temporales
BCrypt para contraseñas - Hash seguro
Validación por evento - Permisos granulares
CORS configurado - Orígenes específicos
Middleware de sockets - Autenticación en tiempo real


Carpeta:
https://docs.google.com/document/d/0KrfJHkbEWbbKN4mG10GGuVFJddk4FbDPT-IR9HgdtgU/edit?usp=sharing
Documento 2:
https://drive.google.com/drive/folders/13IymLqDYeTztX4xZW45r0bzOW11Dzxnw?usp=sharing


