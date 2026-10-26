const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carrito.controller");

/**
 * @swagger
 * tags:
 *   name: Carrito
 *   description: Gestión del carrito de compras
 */

/**
 * @swagger
 * /carrito/{sessionId}:
 *   get:
 *     summary: Obtiene el carrito de una sesión (lo crea si no existe)
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carrito con sus items y total
 */
router.get("/:sessionId", carritoController.obtener);

/**
 * @swagger
 * /carrito/{sessionId}/items:
 *   post:
 *     summary: Agrega un producto al carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               cantidad:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item agregado
 */
router.post("/:sessionId/items", carritoController.agregarItem);

/**
 * @swagger
 * /carrito/items/{itemId}:
 *   put:
 *     summary: Actualiza la cantidad de un item del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item actualizado
 */
router.put("/items/:itemId", carritoController.actualizarCantidad);

/**
 * @swagger
 * /carrito/items/{itemId}:
 *   delete:
 *     summary: Elimina un item del carrito
 *     tags: [Carrito]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item eliminado
 */
router.delete("/items/:itemId", carritoController.eliminarItem);

module.exports = router;