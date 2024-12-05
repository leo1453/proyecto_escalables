const NotesRepository = require('../repositories/notes');
const Note = require('../models/note'); // Cambia la ruta si es necesario

class NotesController {
  async create(req, res) {
    try {
      const { title, content, course, userId } = req.body;
      const file = req.file ? req.file.filename : null; // Obtén el nombre del archivo subido
  
      const newNote = await NotesRepository.create({
        title,
        content,
        course,
        userId,
        file, // Incluye el archivo en la base de datos
      });
  
      res.status(201).json(newNote); // Devuelve la nueva nota creada
    } catch (error) {
      console.error('Error al crear la nota:', error);
      res.status(500).json({ message: 'Error al crear la nota' });
    }
  }
  
  

  async getAll(req, res) {
    try {
      const { userId } = req.query;

      const notes = await NotesRepository.getAllByUser(userId);
      res.status(200).json(notes); // Devuelve todas las notas del usuario
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      res.status(500).json({ message: 'Error al obtener las notas' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const note = await NotesRepository.getById(id);
      if (!note) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }

      res.status(200).json(note);
    } catch (error) {
      console.error('Error al obtener la nota:', error);
      res.status(500).json({ message: 'Error al obtener la nota' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, content, course } = req.body;
  
    try {
      const updatedData = {
        title,
        content,
        course,
      };
  
      // Si se subió un archivo, actualízalo también
      if (req.file) {
        updatedData.file = req.file.filename;
      }
  
      const updatedNote = await Note.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedNote) {
        return res.status(404).json({ error: 'Nota no encontrada' });
      }
  
      res.json(updatedNote);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
      res.status(500).json({ error: 'Error al actualizar la nota' });
    }
  }
  

  async delete(req, res) {
    try {
        const { id } = req.params;
    
        // Validar si el ID es válido
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: 'ID inválido' });
        }
    
        // Intentar eliminar la nota
        const deletedNote = await Note.findByIdAndDelete(id);
    
        if (!deletedNote) {
          return res.status(404).json({ error: 'Nota no encontrada' });
        }
    
        res.status(200).json({ message: 'Nota eliminada exitosamente' });
      } catch (error) {
        console.error('Error al eliminar la nota:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
}

module.exports = new NotesController();
