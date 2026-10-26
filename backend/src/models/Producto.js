const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  imagen: { type: String, trim: true },
  talla: { type: String, enum: ["XS", "S", "M", "L", "XL"], default: "M" },
  color: { type: String, trim: true },
  genero: { type: String, enum: ["hombre", "mujer", "unisex"], default: "unisex" },
  categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
});

module.exports = mongoose.model("Producto", productoSchema);
