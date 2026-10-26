require("dotenv").config();
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const conectarDB = require("./config/db");
const configurarSeguridad = require("./middleware/security.middleware");
const categoriasRoutes = require("./routes/categorias.routes");
const productosRoutes = require("./routes/productos.routes");
const carritoRoutes = require("./routes/carrito.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

configurarSeguridad(app);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ estado: "ok", mensaje: "API de Vortex funcionando" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/categorias", categoriasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
// Carpeta de imágenes subidas (nuevo)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);
if (require.main === module) {
  conectarDB().then(() => {
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en el puerto ${PORT}`),
    );
  });
}

module.exports = app;

