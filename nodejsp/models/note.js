const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el modelo de usuario
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha de creación por defecto
  }, 
  file: {
    type: String, // Guarda el nombre o path del archivo
    required: false,
  },
});

module.exports = mongoose.model('Note', NoteSchema);
