const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Carrito", carritoSchema);
