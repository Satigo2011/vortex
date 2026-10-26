const Producto = require("../models/Producto");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


async function subirImagen(req, res) {
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se recibió ninguna imagen" });
  }
  try {
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "vortex" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    res.status(201).json({ url: resultado.secure_url });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al subir imagen", error: error.message });
  }
}

module.exports = { listar, crear, actualizar, eliminar, subirImagen };