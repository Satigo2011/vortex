function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "No autorizado, falta token" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
  next();
}

module.exports = verificarToken;