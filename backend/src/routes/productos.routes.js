const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productos.controller");
const verificarToken = require("../middleware/auth.middleware");
const upload = require("../middleware/subirImagen.middleware");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Lista productos, opcionalmente filtrados por categoría
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoriaId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtra productos por ID de categoría
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/", productosController.listar);

/**
 * @swagger
 * /productos/imagen:
 *   post:
 *     summary: Sube la imagen de un producto (requiere autenticación)
 *     description: Acepta JPG, PNG o WEBP de hasta 2 MB. Devuelve la URL pública de la imagen, que luego se envía en el campo `imagen` al crear o editar un producto.
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [imagen]
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen guardada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: http://localhost:3001/uploads/3f2a9c1e-5b7d-4e8a-9c0d-1a2b3c4d5e6f.jpg
 *       400:
 *         description: Archivo ausente, tipo no permitido o mayor a 2 MB
 *       401:
 *         description: No autorizado
 */
router.post(
  "/imagen",
  verificarToken,
  (req, res, next) => {
    upload.single("imagen")(req, res, (err) => {
      if (err) {
        const mensaje =
          err.code === "LIMIT_FILE_SIZE"
            ? "La imagen supera los 2 MB"
            : err.message;
        return res.status(400).json({ mensaje });
      }
      next();
    });
  },
  productosController.subirImagen,
);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto (requiere autenticación)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado
 */
router.post("/", verificarToken, productosController.crear);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente (requiere autenticación)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.put("/:id", verificarToken, productosController.actualizar);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Elimina un producto (requiere autenticación)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/:id", verificarToken, productosController.eliminar);

module.exports = router;