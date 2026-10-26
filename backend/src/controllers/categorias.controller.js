const Categoria = require("../models/Categoria");

async function listar(req, res) {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al listar categorias", error: error.message });
  }
}

async function crear(req, res) {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear categoria", error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!categoria) return res.status(404).json({ mensaje: "Categoria no encontrada" });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar categoria", error: error.message });
  }
}

async function eliminar(req, res) {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: "Categoria no encontrada" });
    res.json({ mensaje: "Categoria eliminada" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar categoria", error: error.message });
  }
}

module.exports = { listar, crear, actualizar, eliminar };