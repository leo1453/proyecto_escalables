const Assignment = require('../models/assignment');

class AssignmentsRepository {
  async create(assignmentData) {
    const assignment = new Assignment(assignmentData);
    return await assignment.save(); // Guarda la asignación en la base de datos
  }

  async getAllByUser(userId) {
    return await Assignment.find({ userId }); // Busca todas las asignaciones de un usuario
  }

  async getById(assignmentId) {
    return await Assignment.findById(assignmentId); // Busca una asignación por su ID
  }

  async update(assignmentId, updatedData) {
    return await Assignment.findByIdAndUpdate(assignmentId, updatedData, { new: true }); // Actualiza la asignación y devuelve la versión actualizada
  }

  async delete(assignmentId) {
    return await Assignment.findByIdAndDelete(assignmentId); // Elimina la asignación por su ID
  }
}

module.exports = new AssignmentsRepository();
