const Note = require('../models/note');

class NotesRepository {
  async create(noteData) {
    const note = new Note(noteData);
    return await note.save(); // Guarda la nota en la base de datos
  }

  async getAllByUser(userId) {
    return await Note.find({ userId }); // Busca todas las notas de un usuario
  }

  async getById(noteId) {
    return await Note.findById(noteId); // Busca una nota por su ID
  }

  async update(noteId, updatedData) {
    return await Note.findByIdAndUpdate(noteId, updatedData, { new: true }); // Actualiza la nota y devuelve la versión actualizada
  }

  async delete(noteId) {
    return await Note.findByIdAndDelete(noteId); // Elimina la nota por su ID
  }
}

module.exports = new NotesRepository();
