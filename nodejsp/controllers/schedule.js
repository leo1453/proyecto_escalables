const Schedule = require('../models/schedule');

const createOrUpdateSchedule = async (req, res) => {
    const { userId, schedule } = req.body;
  
    try {
      // Busca un horario existente para el usuario
      let existingSchedule = await Schedule.findOne({ userId });
  
      if (existingSchedule) {
        // Si existe, actualiza el horario
        existingSchedule.schedule = schedule;
        await existingSchedule.save();
        return res.status(200).json({ msg: 'Horario actualizado exitosamente', schedule: existingSchedule });
      } else {
        // Si no existe, crea uno nuevo
        const newSchedule = new Schedule({ userId, schedule });
        await newSchedule.save();
        return res.status(201).json({ msg: 'Horario creado exitosamente', schedule: newSchedule });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      res.status(500).json({ msg: 'Error al guardar el horario', error });
    }
  };

const getSchedule = async (req, res) => {
    const { userId } = req.params;

    try {
        const schedule = await Schedule.findOne({ userId });
        if (!schedule) {
            return res.status(404).json({ msg: 'No se encontró el horario' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el horario', error });
    }
};

module.exports = { createOrUpdateSchedule, getSchedule };
