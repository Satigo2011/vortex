# Vortex

Tienda de ropa en línea — proyecto de aula (reemplaza el Examen Final).

Backend y frontend viven en este mismo repositorio pero son dos proyectos independientes: cada uno tiene su propio `package.json` y se corre por separado. La única comunicación entre ellos es por la API REST (HTTP/JSON), el backend nunca renderiza vistas.

## Integrantes

- Santiago Antolinez
- Caren Diaz
- David Hernández

## Estructura

```
vortex/
  backend/    -> API REST (Node.js + Express + MongoDB Atlas)
  frontend/   -> catálogo, carrito, panel admin (Vue + Vue Router + SCSS + Vite)
```

## Cómo correrlo

Necesitas dos terminales abiertas, una por proyecto.

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # y poner ahí la URI real de MongoDB Atlas y las credenciales del admin
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

El frontend espera el backend corriendo en `http://localhost:3001`.
La documentación de la API (Swagger) está en `http://localhost:3001/api-docs`.

## Estado del proyecto por semana

- **Semana 11**: modelos, conexión a MongoDB Atlas y endpoints REST documentados con Swagger (`/api-docs`) — completo.
- **Semana 12**: CRUD completo de categorías y productos, verificado de punta a punta:
  - Creación y eliminación de categorías y productos vía Postman/Swagger
  - Catálogo del frontend consumiendo la API real, con filtro por categoría funcionando
  - Panel de administrador (crear/eliminar producto) sincronizado en tiempo real con el catálogo, sin recargar la página
  - Completo.
- **Semana 13**: carrito de compras y panel de administrador:
  - Carrito con agregar, quitar y modificar cantidades; el total se calcula en el backend
  - Si el admin borra un producto que está en un carrito, el item se elimina del carrito sin romper la página
  - Panel de administrador con login y CRUD completo de productos y categorías (crear, listar, editar y eliminar)
  - Completo.

## Pendiente

- Semana 14: seguridad (HTTPS, XSS, CSRF)
- Semana 15: integración final, pruebas y documentación técnica
- Semana 16: despliegue y sustentación