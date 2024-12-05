const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schedule: [
    {
      hour: { type: String, required: true }, // Hora del horario (ej. "8:00 AM")
      day: { type: String, required: true }, // Día de la semana (ej. "Lunes")
      subject: {
        name: { type: String, required: true }, // Nombre de la materia
        profesor: { type: String, required: true }, // Nombre del profesor
        salon: { type: String, required: true } // Salón de clases
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
