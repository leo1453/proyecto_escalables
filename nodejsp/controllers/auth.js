const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Importa tu modelo de usuario
const bcrypt = require('bcryptjs'); // Importa bcrypt para verificar contraseñas

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca al usuario por su correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
    }

    // Compara la contraseña directamente sin encriptación
    if (password !== user.password) {
      return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Incluye el rol en el token
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Tiempo de expiración del token
    );

    // Devuelve el token, el nombre de usuario y el ID del usuario
    res.status(200).json({
      msg: 'Inicio de sesión exitoso',
      token: token,
      userId: user._id, // Incluye el userId en la respuesta
      username: user.name, // Asegúrate de que 'user.name' sea la propiedad correcta
      role: user.role, // Devuelve el rol del usuario
    });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ msg: 'Error en el servidor', error });
  }
};

module.exports = { loginUser };
