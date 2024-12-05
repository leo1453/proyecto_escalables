const { Router } = require('express');
const { createOrUpdateSchedule, getSchedule } = require('../controllers/schedule');
const router = Router();

router.post('/create', createOrUpdateSchedule);
router.get('/:userId', getSchedule); // Nueva ruta para obtener el horario

module.exports = router;
