const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user', // Los nuevos usuarios serán 'user' por defecto
    enum: ['user', 'admin'], // Solo se permiten estos valores
  },
});

module.exports = mongoose.model('User', userSchema);
