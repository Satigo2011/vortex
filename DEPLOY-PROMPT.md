# Prompt de Despliegue — Vortex

Copia y pega este texto en el chat de Claude Code (VS Code) para desplegar el proyecto.

---

## PROMPT PARA PEGAR EN CLAUDE CODE

```
Necesito desplegar el proyecto Vortex para que cualquier persona pueda acceder
desde internet durante la sustentación, sin depender del computador de ningún
integrante del equipo.

El proyecto tiene:
- backend/   → API REST con Express.js y MongoDB Atlas (puerto 3001)
- frontend/  → SPA con Vue 3 + Vite (puerto 5173)

Quiero desplegarlo así (servicios 100 % gratuitos):
  • Base de datos → MongoDB Atlas (ya existe, solo necesita el cluster de producción)
  • Backend      → Render  (render.com, plan Free)
  • Frontend     → Vercel  (vercel.com, plan Hobby)

Haz lo siguiente paso a paso:

────────────────────────────────────────
PASO 1 — Preparar el backend para producción
────────────────────────────────────────
1. Revisa backend/src/index.js y asegúrate de que el servidor escucha en
   process.env.PORT (Render asigna el puerto dinámicamente).
2. Revisa backend/.env.example y lista todas las variables de entorno que
   debo configurar en Render (MONGO_URI, APP_ORIGIN, API_ORIGIN,
   ADMIN_USER, ADMIN_PASSWORD, ADMIN_TOKEN).
3. Verifica que backend/package.json tiene el script "start": "node src/index.js"
   (Render lo usa para arrancar el servicio).
4. Crea el archivo backend/render.yaml con la configuración del servicio web
   para que Render detecte el proyecto automáticamente.

────────────────────────────────────────
PASO 2 — Preparar el frontend para producción
────────────────────────────────────────
1. Revisa frontend/vite.config.js: la variable VITE_API_URL debe apuntar a la
   URL del backend en Render (la definiré como variable de entorno en Vercel).
2. Crea el archivo frontend/vercel.json para que Vercel sirva el SPA de Vue
   correctamente (reescritura de rutas a index.html).
3. Confirma que frontend/package.json tiene los scripts "build" y "preview".

────────────────────────────────────────
PASO 3 — Archivos de configuración necesarios
────────────────────────────────────────
Crea o actualiza estos archivos si no existen o están incompletos:
- backend/render.yaml
- frontend/vercel.json
- Un archivo .gitignore en la raíz que excluya node_modules, .env y uploads/

────────────────────────────────────────
PASO 4 — Instrucciones finales para el equipo
────────────────────────────────────────
Al terminar muéstrame:
1. Checklist de lo que debo hacer manualmente en render.com y vercel.com
   (crear cuenta, conectar repo, pegar variables de entorno).
2. Las variables de entorno exactas que debo poner en Render y en Vercel,
   con el formato NOMBRE=valor (sin valores secretos reales, solo los nombres
   y una descripción de qué poner).
3. El orden correcto: primero desplegar el backend, obtener su URL, y luego
   usarla como VITE_API_URL al desplegar el frontend.
```

---

## ¿QUÉ HACE CADA SERVICIO?

| Servicio | Qué aloja | URL resultante (ejemplo) |
|---|---|---|
| **MongoDB Atlas** | Base de datos | `cluster.mongodb.net` |
| **Render** | Backend (API Express) | `https://vortex-api.onrender.com` |
| **Vercel** | Frontend (Vue) | `https://vortex-app.vercel.app` |

## PASOS MANUALES RÁPIDOS (resumen)

1. Sube el proyecto a **GitHub** si aún no está.
2. En **render.com** → New Web Service → conecta el repo → carpeta `backend`.
3. En **vercel.com** → New Project → conecta el repo → carpeta `frontend`.
4. Pega las variables de entorno en cada plataforma.
5. Comparte la URL de Vercel con todo el equipo.

## VARIABLES DE ENTORNO (Render — backend)

```
PORT            = (Render lo asigna solo, no lo configures)
MONGO_URI       = mongodb+srv://usuario:contraseña@cluster.mongodb.net/vortex
APP_ORIGIN      = https://TU-APP.vercel.app   ← URL de Vercel
API_ORIGIN      = https://TU-API.onrender.com ← URL de Render
ADMIN_USER      = admin
ADMIN_PASSWORD  = (contraseña segura)
ADMIN_TOKEN     = (token seguro)
```

## VARIABLES DE ENTORNO (Vercel — frontend)

```
VITE_API_URL = https://TU-API.onrender.com/api  ← URL de Render + /api
```
