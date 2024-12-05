// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extraer token del header

  if (!token) {
    return res.status(403).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Verificar el token y extraer el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar la información del usuario decodificada en la request
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};

module.exports = verifyToken;
