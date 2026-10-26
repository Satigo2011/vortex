# Vortex — Frontend (Vue)

Catálogo, carrito y panel de administrador de Vortex (tienda de ropa online). Vue 3 + Vue Router + SCSS, con Vite como gestor de dependencias/automatizador.

## Línea visual

La identidad combina tinta oscura, papel claro, azul hielo y coral, con Space Grotesk para titulares y DM Sans para lectura. El catálogo, el carrito y el acceso administrativo usan una composición tipográfica y bloques de color; las fotografías de producto quedan pendientes. Los layouts se reorganizan para pantallas pequeñas.

## Requisitos

- Node.js instalado
- El backend (`../backend`) corriendo en `http://localhost:3001`

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173` en el navegador (con el backend ya corriendo).

## SCSS y Vite

- **SCSS** está en `src/styles/main.scss`: concentra colores y tipografías en variables CSS, agrupa reglas relacionadas y adapta catálogo, carrito y panel con media queries. No se necesita compilar SCSS manualmente.
- **Vite** administra las dependencias declaradas en `package.json`, sirve el entorno de desarrollo con recarga rápida y crea la versión de producción con `npm run build` (salida en `dist/`). La configuración agrega CSP al HTML y encabezados de protección en desarrollo/preview.
- `VITE_API_URL` permite cambiar la URL del API al construir. En desarrollo se usa `http://localhost:3001/api`; en producción, si no se define, se usa `/api` en el mismo origen HTTPS.

La CSP de producción permite scripts propios, bloquea objetos y actualiza solicitudes inseguras a HTTPS. En desarrollo se habilitan los estilos insertados por Vite y WebSocket para HMR.

## Estructura

```
index.html                 -> punto de montaje de Vue
src/
  main.js                  -> arranque de la app
  App.vue                  -> layout y navegación
  router/index.js          -> rutas: catálogo, carrito, admin
  views/
    Catalogo.vue           -> catálogo público, filtra por categoría
    Carrito.vue            -> carrito de compras (agregar, quitar, cambiar cantidad, total)
    Admin.vue              -> panel de administrador (login y CRUD de productos y categorías)
  services/api.js          -> funciones que llaman al backend
  styles/main.scss         -> estilos con SCSS
```

Pendiente: seguridad (HTTPS, XSS, CSRF) y despliegue.
