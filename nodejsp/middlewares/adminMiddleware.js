module.exports = (req, res, next) => {
    const role = req.userRole; // Asegúrate de que `req.userRole` se establezca en `authMiddleware`
    if (role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Acceso denegado: solo para administradores" });
    }
  };
  