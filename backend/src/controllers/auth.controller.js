function login(req, res) {
  const { usuario, contrasena } = req.body;
  if (usuario === process.env.ADMIN_USER && contrasena === process.env.ADMIN_PASSWORD) {
    return res.json({ token: process.env.ADMIN_TOKEN });
  }
  res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
}

module.exports = { login };