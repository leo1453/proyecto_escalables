const express = require('express');
const AssignmentsController = require('../controllers/assignments');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para verificar el token JWT

const router = express.Router();

// Crear una nueva asignación
router.post('/', authMiddleware, AssignmentsController.create);

// Obtener todas las asignaciones de un usuario
router.get('/', authMiddleware, AssignmentsController.getAll);

// Obtener una asignación por su ID
router.get('/:id', authMiddleware, AssignmentsController.getById);

// Actualizar una asignación por su ID
router.put('/:id', authMiddleware, AssignmentsController.update);

// Eliminar una asignación por su ID
router.delete('/:id', authMiddleware, AssignmentsController.delete);

// Ruta para actualizar el estado de 'completed'
router.put('/:id/completed', authMiddleware, AssignmentsController.updateCompleted);
module.exports = router;
