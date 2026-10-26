const Producto = require("../models/Producto");

async function listar(req, res) {
  try {
    const filtro = {};
    if (req.query.categoriaId) filtro.categoriaId = req.query.categoriaId;
    const productos = await Producto.find(filtro).populate("categoriaId");
    res.json(productos);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al listar productos", error: error.message });
  }
}

async function crear(req, res) {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear producto", error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar producto", error: error.message });
  }
}


function subirImagen(req, res) {
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se recibió ninguna imagen" });
  }
  const base = process.env.PUBLIC_URL || `${req.protocol}://${req.get("host")}`;
  res.status(201).json({ url: `${base}/uploads/${req.file.filename}` });
}

module.exports = { listar, crear, actualizar, eliminar, subirImagen };