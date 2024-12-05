// routes/messages.js
const { Router } = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación
const { getMessages, sendMessage } = require('../controllers/messages'); // Controlador de mensajes

const router = Router();

// Ruta para obtener todos los mensajes del usuario autenticado
router.get('/', authMiddleware, getMessages);

// Ruta para enviar un mensaje
router.post('/', authMiddleware, sendMessage);

module.exports = router;
