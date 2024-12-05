const {Router} = require('express');
const { getAllUsers, createNewUser, updateUser, deleteUser, getUserById } = require('../controllers/users');
const router = Router();

router.get("/", getAllUsers);
router.post("/", createNewUser);
router.put("/:id", updateUser); // Ruta para actualizar un usuario por ID
router.delete("/:id", deleteUser); // Ruta para eliminar un usuario por ID
// Ruta para obtener un usuario por ID
router.get("/:id", getUserById);

module.exports = router;