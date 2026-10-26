const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación del panel de administrador
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión como administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve un token
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/login", login);

module.exports = router;