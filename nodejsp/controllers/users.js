const { getAllUsers, createNewUser, updateUser, deleteUser, getUserById } = require('../repositories/users');

// Controlador para obtener todos los usuarios
// Controlador para obtener todos los usuarios, excluyendo al usuario autenticado
const getAllUsersController = async (req, res) => {
  try {
    const authenticatedUserId = req.userId;  // Suponiendo que tu middleware de autenticación lo guarda en req.userId
    const users = await getAllUsers();  // Obtener todos los usuarios
    const filteredUsers = users.filter(user => user._id !== authenticatedUserId);  // Filtrar al usuario autenticado
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los usuarios', error });
  }
};


// Controlador para crear un nuevo usuario
const createNewUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }
    const newUser = await createNewUser({ name, email, password });
    res.status(201).json({ msg: 'Usuario creado exitosamente', user: newUser });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el usuario', error });
  }
};

// Controlador para actualizar un usuario
const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const user = await updateUser(userId, updatedData);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.status(200).json({ msg: 'Usuario actualizado exitosamente', user });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar el usuario', error });
  }
};

// Controlador para eliminar un usuario
const deleteUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await deleteUser(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el usuario', error });
  }
};

// Controlador para obtener un usuario por ID
const getUserByIdController = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener el usuario', error });
    }
  };

module.exports = {
  getAllUsers: getAllUsersController,
  createNewUser: createNewUserController,
  updateUser: updateUserController,
  deleteUser: deleteUserController,
  getUserById: getUserByIdController, // Exporta la función
};
