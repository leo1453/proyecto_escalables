const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

class Server {
    constructor() {
        this.port = process.env.PORT || 8080;
        this.app = express();
        this.corsOptions = {
            origin: [
                process.env.FRONTEND_URL
            ]
        };

           // Definición de las rutas principales
           this.usersPath = "/api/users";
           this.authPath = "/api/auth"; // Ruta para autenticación
           this.schedulesPath = "/api/schedules"; // Nueva ruta para horarios
           this.notesPath = "/api/notes"; // Ruta para notas
           this.assignmentsPath = '/api/assignments';
           this.messagesPath = "/api/messages"; // Nueva ruta para mensajes
           this.adminPath = "/api/admin"; // Nueva ruta para administrador

           // Middlewares
        this.middleware();

        // Rutas de la aplicación
        this.routes();

        // Conectar a la base de datos
        connectDB();
    }

    routes() {
        this.app.use(this.usersPath, require("../routes/user"));
        this.app.use(this.authPath, require("../routes/auth")); // Importa y usa las rutas de autenticación
        this.app.use(this.schedulesPath, require("../routes/schedule")); // Rutas de horarios
        this.app.use(this.notesPath, require("../routes/notes")); // Conecta las rutas de notas
        this.app.use(this.assignmentsPath, require('../routes/assignments'));
        this.app.use(this.messagesPath, require("../routes/messages")); // Rutas de mensajes
        this.app.use(this.adminPath, require("../routes/adminRoutes")); // Rutas de administrador
        this.app.use('/uploads', express.static('uploads'));


        // Manejo de rutas no encontradas
        this.app.get("*", (req, res) => {
            res.status(404).json({
                msg: "Ruta no encontrada",
                result: 123456,
            });
        });

        this.app.post("*", (req, res) => {
            res.status(404).json({
                msg: "Ruta no encontrada",
                result: 123456,
            });
        });
    }

    middleware() {
        this.app.use(cors(this.corsOptions));
        this.app.use(express.json()); // Permite recibir JSON en las solicitudes
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
