const assert = require("node:assert/strict");
const http = require("node:http");
const { after, before, test } = require("node:test");

process.env.NODE_ENV = "production";
process.env.APP_ORIGIN = "https://vortex.test";
process.env.API_ORIGIN = "https://api.vortex.test";

const app = require("../src/index");
const servidor = http.createServer(app);
let baseUrl;

before(async () => {
  await new Promise((resolve) => servidor.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((error) => (error ? reject(error) : resolve()));
  });
});

test("rechaza HTTP sin TLS cuando la app está en producción", async () => {
  const respuesta = await fetch(`${baseUrl}/api/health`);
  assert.equal(respuesta.status, 426);
  assert.deepEqual(await respuesta.json(), {
    mensaje: "HTTPS es obligatorio.",
  });
});

test("acepta HTTPS detrás del proxy y envía CSP y HSTS", async () => {
  const respuesta = await fetch(`${baseUrl}/api/health`, {
    headers: { "X-Forwarded-Proto": "https" },
  });
  const politica = respuesta.headers.get("content-security-policy");

  assert.equal(respuesta.status, 200);
  assert.match(politica, /default-src 'self'/);
  assert.match(politica, /object-src 'none'/);
  assert.match(politica, /upgrade-insecure-requests/);
  assert.match(
    respuesta.headers.get("strict-transport-security"),
    /max-age=31536000/,
  );
});

test("bloquea una escritura desde un origen ajeno", async () => {
  const respuesta = await fetch(`${baseUrl}/api/ruta-de-prueba`, {
    method: "POST",
    headers: {
      Origin: "https://sitio-malicioso.test",
      "Content-Type": "application/json",
      "X-Forwarded-Proto": "https",
    },
    body: JSON.stringify({ accion: "cambiar datos" }),
  });

  assert.equal(respuesta.status, 403);
  assert.deepEqual(await respuesta.json(), { mensaje: "Origen no permitido." });
});

test("bloquea escrituras sin encabezado Origin", async () => {
  const respuesta = await fetch(`${baseUrl}/api/ruta-de-prueba`, {
    method: "DELETE",
    headers: { "X-Forwarded-Proto": "https" },
  });

  assert.equal(respuesta.status, 403);
});

test("permite que el origen configurado llegue al enrutador", async () => {
  const respuesta = await fetch(`${baseUrl}/api/ruta-de-prueba`, {
    method: "POST",
    headers: {
      Origin: "https://vortex.test",
      "Content-Type": "application/json",
      "X-Forwarded-Proto": "https",
    },
    body: JSON.stringify({ accion: "prueba permitida" }),
  });

  assert.equal(respuesta.status, 404);
  assert.equal(
    respuesta.headers.get("access-control-allow-origin"),
    "https://vortex.test",
  );
});
