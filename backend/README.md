# Vortex — Backend

API REST de Vortex (tienda de ropa online). Node.js + Express + MongoDB Atlas (Mongoose).

## Requisitos

- Node.js instalado
- Una base de datos en MongoDB Atlas

## Cómo correrlo

1. Clonar el repo:

```bash
   git clone <url-de-este-repo>
   cd vortex/backend
```

2. Instalar dependencias:

```bash
   npm install
```

3. Crear un archivo `.env` copiando `.env.example` y poner ahí la cadena de conexión real de MongoDB Atlas y las credenciales del administrador:

```bash
   cp .env.example .env
```

4. Correr en modo desarrollo:

```bash
   npm run dev
```

5. Probar que funciona entrando a `http://localhost:3001/api/health`

## Variables de entorno

- `PORT`: puerto del servidor (por defecto 3001)
- `MONGO_URI`: cadena de conexión de MongoDB Atlas
- `MONGO_DNS_SERVERS`: opcional; servidores DNS separados por comas si Node no puede resolver el registro SRV de Atlas
- `APP_ORIGIN`: origen exacto del frontend; en producción debe usar `https://`
- `API_ORIGIN`: origen público del API, usado por CORS y CSP
- `ADMIN_USER` y `ADMIN_PASSWORD`: credenciales del administrador
- `ADMIN_TOKEN`: token que se entrega al hacer login

## Seguridad y sustentación

- **HTTPS:** en producción, Express acepta tráfico sólo cuando el proxy confiable informa `X-Forwarded-Proto: https`; una solicitud HTTP recibe `426`. El certificado TLS debe configurarse en el proxy o plataforma de despliegue. En desarrollo local se permite HTTP.
- **XSS:** las vistas muestran nombres y descripciones con interpolación de Vue (`{{ dato }}`), que escapa HTML; no se usa `v-html`. La CSP de Vite limita scripts a `'self'` y Helmet refuerza la política en las respuestas del API.
- **CSRF:** cada `POST`, `PUT`, `PATCH` y `DELETE` debe incluir un encabezado `Origin` que coincida exactamente con `APP_ORIGIN` o `API_ORIGIN`. Un origen externo o ausente recibe `403`; CORS también limita los orígenes del navegador.

Ejecutar las comprobaciones automáticas desde `backend/`:

```bash
npm test
```

Los cinco casos verifican el rechazo de HTTP en producción, HTTPS detrás del proxy, CSP/HSTS, rechazo de escrituras sin origen y rechazo de un origen malicioso. Para mostrar XSS en la sustentación, crea temporalmente un producto de prueba cuyo nombre sea `<img src=x onerror=alert(1)>`: en el catálogo debe verse como texto literal, sin crear una imagen ni ejecutar una alerta. Elimina el registro de prueba al terminar.

En despliegue, define `NODE_ENV=production`, configura `APP_ORIGIN=https://...` y el `API_ORIGIN` HTTPS real. El proxy debe terminar TLS y sobrescribir `X-Forwarded-Proto`; no expongas Express directamente confiando encabezados reenviados por clientes.

## Documentación de la API

Swagger/OpenAPI disponible en `http://localhost:3001/api-docs`.

## Estructura

```
src/
  config/db.js          -> conexión a MongoDB
  config/swagger.js     -> configuración de Swagger
  middleware/           -> verificación del token de administrador
  models/               -> esquemas de Mongoose (Categoria, Producto, Carrito, ItemCarrito)
  controllers/          -> lógica de cada recurso
  routes/               -> rutas de la API
  index.js              -> arranque del servidor
```

## Endpoints disponibles

- `GET /api/health`
- `POST /api/auth/login` (devuelve el token del administrador)
- `GET /api/categorias` · `POST /api/categorias` · `PUT /api/categorias/:id` · `DELETE /api/categorias/:id`
- `GET /api/productos` (acepta `?categoriaId=` para filtrar) · `POST /api/productos` · `PUT /api/productos/:id` · `DELETE /api/productos/:id`
- `GET /api/carrito/:sessionId` · `POST /api/carrito/:sessionId/items` · `PUT /api/carrito/items/:itemId` · `DELETE /api/carrito/items/:itemId`

Los endpoints que crean, editan o eliminan categorías y productos requieren el token de administrador (`Authorization: Bearer <token>`).

Pendiente: seguridad (HTTPS, XSS, CSRF).
