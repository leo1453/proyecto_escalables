const express = require('express');
const NotesController = require('../controllers/notes');
const upload = require('../middlewares/upload'); // Importa multer

const router = express.Router();

// Crear una nueva nota
router.post('/', upload.single('file'), NotesController.create);

// Obtener todas las notas de un usuario
router.get('/', NotesController.getAll);

// Obtener una nota por su ID
router.get('/:id', NotesController.getById);

// Actualizar una nota por su ID
router.put('/:id', upload.single('file'), NotesController.update);

// Eliminar una nota por su ID
router.delete('/:id', NotesController.delete);

module.exports = router;
