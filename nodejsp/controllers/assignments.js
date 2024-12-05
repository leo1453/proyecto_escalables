const AssignmentsRepository = require('../repositories/assignments');
const Assignment = require('../models/assignment'); // Cambia la ruta si es necesario

class AssignmentsController {
  async create(req, res) {
    try {
      const { title, description, dueDate, priority, type, course } = req.body;
      const userId = req.userId; // El ID del usuario autenticado (proporcionado por el middleware)

      const newAssignment = await AssignmentsRepository.create({
        title,
        description,
        dueDate,
        priority,
        type,
        course,
        userId, // Asocia la asignación al usuario
      });

      res.status(201).json(newAssignment); // Devuelve la nueva asignación creada
    } catch (error) {
      console.error('Error al crear la asignación:', error);
      res.status(500).json({ message: 'Error al crear la asignación' });
    }
  }

 // Obtener todas las asignaciones de un usuario (backend)
 async getAll(req, res) {
  try {
    const userId = req.query.userId; // Obtener el userId desde la URL

    // Obtener todas las asignaciones del usuario autenticado
    const assignments = await AssignmentsRepository.getAllByUser(userId);
    
    console.log('Asignaciones encontradas:', assignments); // Agrega un log para verificar

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'No tienes asignaciones creadas aún.' });
    }

    res.status(200).json(assignments); // Devuelve todas las asignaciones del usuario
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    res.status(500).json({ message: 'Error al obtener las asignaciones' });
  }
}



  async getById(req, res) {
    try {
      const { id } = req.params;

      const assignment = await AssignmentsRepository.getById(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Asignación no encontrada' });
      }

      res.status(200).json(assignment);
    } catch (error) {
      console.error('Error al obtener la asignación:', error);
      res.status(500).json({ message: 'Error al obtener la asignación' });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, dueDate, priority, type, course } = req.body;

    try {
      const updatedAssignment = await Assignment.findByIdAndUpdate(
        id,
        { title, description, dueDate, priority, type, course },
        { new: true }
      );

      if (!updatedAssignment) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }

      res.json(updatedAssignment);
    } catch (error) {
      console.error('Error al actualizar la asignación:', error);
      res.status(500).json({ error: 'Error al actualizar la asignación' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
  
      // Verifica que el id sea válido y existe en la base de datos
      const deletedAssignment = await Assignment.findByIdAndDelete(id);
  
      if (!deletedAssignment) {
        return res.status(404).json({ error: 'Asignación no encontrada' });
      }
  
      res.status(200).json({ message: 'Asignación eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la asignación:', error);
      res.status(500).json({ error: 'Error al eliminar la asignación' });
    }
  }
  
  async updateCompleted(req, res) {
    try {
      const { id } = req.params; // Obtén el ID de la asignación desde los parámetros de la ruta
      const { completed } = req.body; // Obtén el valor de 'completed' desde el cuerpo de la solicitud
  
      // Asegúrate de que el campo 'completed' sea un booleano
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'El campo completed debe ser un valor booleano' });
      }
  
      // Actualiza la asignación con el nuevo valor de 'completed'
      const updatedAssignment = await Assignment.findByIdAndUpdate(
        id,
        { completed },
        { new: true } // Retorna el documento actualizado
      );
  
      if (!updatedAssignment) {
        return res.status(404).json({ message: 'Asignación no encontrada' });
      }
  
      res.status(200).json(updatedAssignment); // Devuelve la asignación actualizada
    } catch (error) {
      console.error('Error al actualizar la asignación:', error);
      res.status(500).json({ message: 'Error al actualizar la asignación' });
    }
  }

  
}

module.exports = new AssignmentsController();
