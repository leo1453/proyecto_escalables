const User = require('../models/user');

// Función para obtener todos los usuarios
const getAllUsers = async () => {
  return await User.find();
};

// Función para crear un nuevo usuario
const createNewUser = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Función para actualizar un usuario por ID
const updateUser = async (userId, updatedData) => {
  return await User.findByIdAndUpdate(userId, updatedData, { new: true });
};

// Función para eliminar un usuario por ID
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

// Función para obtener un usuario por ID
const getUserById = async (userId) => {
    return await User.findById(userId);
  };

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUserById, // Exporta la función
};
