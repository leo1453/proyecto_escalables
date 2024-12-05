const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó el token' });
  }

  const token = authHeader.split(' ')[1]; // Extrae el token del encabezado

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    req.userId = decoded.id; // Extrae el userId del token
    req.userRole = decoded.role; // Extrae el rol del usuario (asegúrate de incluir el rol en el token JWT al generarlo)
    next(); // Continúa con la solicitud
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
