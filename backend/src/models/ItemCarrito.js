const mongoose = require("mongoose");

const itemCarritoSchema = new mongoose.Schema({
  carritoId: { type: mongoose.Schema.Types.ObjectId, ref: "Carrito", required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  cantidad: { type: Number, required: true, min: 1, default: 1 },
  precioUnitario: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model("ItemCarrito", itemCarritoSchema);
