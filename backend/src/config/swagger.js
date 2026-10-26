const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vortex API",
      version: "1.0.0",
      description: "API REST de la tienda Vortex (categorías, productos, carrito)",
    },
    servers: [
      { url: "http://localhost:3001/api", description: "Servidor local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        Categoria: {
          type: "object",
          properties: {
            _id: { type: "string" },
            nombre: { type: "string" },
            descripcion: { type: "string" },
          },
        },
        Producto: {
          type: "object",
          properties: {
            _id: { type: "string" },
            nombre: { type: "string" },
            descripcion: { type: "string" },
            precio: { type: "number" },
            stock: { type: "number" },
            imagen: { type: "string" },
            talla: { type: "string", enum: ["XS", "S", "M", "L", "XL"] },
            color: { type: "string" },
            genero: { type: "string", enum: ["hombre", "mujer", "unisex"] },
            categoriaId: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);