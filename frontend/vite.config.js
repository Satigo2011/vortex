import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const desarrollo = mode === "development";
  const entorno = loadEnv(mode, process.cwd(), "");
  const apiUrl =
    entorno.VITE_API_URL || (desarrollo ? "http://localhost:3001/api" : "");
  const conexiones = ["'self'"];
  // blob: = vista previa de la imagen elegida; origen del API = imágenes en /uploads
  const imagenes = ["'self'", "data:", "blob:", "https:"];

  if (apiUrl) {
    conexiones.push(new URL(apiUrl).origin);
    imagenes.push(new URL(apiUrl).origin);
  }
  if (desarrollo) {
    conexiones.push(
      "ws://localhost:5173",
      "ws://127.0.0.1:5173",
      "ws://localhost:5174",
      "ws://127.0.0.1:5174",
    );
  }

  const politica = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "font-src 'self' https://fonts.gstatic.com",
    `img-src ${imagenes.join(" ")}`,
    "object-src 'none'",
    "script-src 'self'",
    `style-src 'self' ${desarrollo ? "'unsafe-inline' " : ""}https://fonts.googleapis.com`,
    `connect-src ${conexiones.join(" ")}`,
    ...(desarrollo ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");

  const encabezados = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };

  return {
    plugins: [
      vue(),
      {
        name: "vortex-content-security-policy",
        transformIndexHtml() {
          return {
            tags: [
              {
                tag: "meta",
                attrs: {
                  "http-equiv": "Content-Security-Policy",
                  content: politica,
                },
                injectTo: "head",
              },
            ],
          };
        },
      },
    ],
    server: { port: 5173, headers: encabezados },
    preview: { headers: encabezados },
  };
});