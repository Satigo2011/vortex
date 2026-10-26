const Carrito = require("../models/Carrito");
const ItemCarrito = require("../models/ItemCarrito");
const Producto = require("../models/Producto");

async function obtenerOCrearCarrito(sessionId) {
  let carrito = await Carrito.findOne({ sessionId });
  if (!carrito) {
    carrito = await Carrito.create({ sessionId });
  }
  return carrito;
}

exports.obtener = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const carrito = await obtenerOCrearCarrito(sessionId);
    const items = await ItemCarrito.find({ carritoId: carrito._id }).populate("productoId");

    // Items cuyo producto ya fue borrado por el admin: se eliminan del carrito
    const huerfanos = items.filter((item) => !item.productoId);
    if (huerfanos.length > 0) {
      await ItemCarrito.deleteMany({ _id: { $in: huerfanos.map((item) => item._id) } });
    }

    const itemsValidos = items.filter((item) => item.productoId);
    const total = itemsValidos.reduce((suma, item) => suma + item.precioUnitario * item.cantidad, 0);
    res.json({ carritoId: carrito._id, items: itemsValidos, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.agregarItem = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productoId, cantidad } = req.body;
    const carrito = await obtenerOCrearCarrito(sessionId);
    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    let item = await ItemCarrito.findOne({ carritoId: carrito._id, productoId });
    if (item) {
      item.cantidad += cantidad || 1;
      await item.save();
    } else {
      item = await ItemCarrito.create({
        carritoId: carrito._id,
        productoId,
        cantidad: cantidad || 1,
        precioUnitario: producto.precio,
      });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarCantidad = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { cantidad } = req.body;
    if (cantidad < 1) return res.status(400).json({ error: "La cantidad debe ser al menos 1" });

    const item = await ItemCarrito.findByIdAndUpdate(itemId, { cantidad }, { new: true });
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await ItemCarrito.findByIdAndDelete(itemId);
    if (!item) return res.status(404).json({ error: "Item no encontrado" });
    res.json({ mensaje: "Item eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};