const apiPorDefecto = import.meta.env.PROD
  ? `${window.location.origin}/api`
  : "http://localhost:3001/api";
const API_URL = (import.meta.env.VITE_API_URL || apiPorDefecto).replace(
  /\/$/,
  "",
);

async function solicitud(path, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${path}`, opciones);
  const datos = respuesta.headers
    .get("content-type")
    ?.includes("application/json")
    ? await respuesta.json()
    : {};

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || `La solicitud falló (${respuesta.status}).`,
    );
  }

  return datos;
}

function obtenerSessionId() {
  let sessionId = localStorage.getItem("vortex_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("vortex_session_id", sessionId);
  }
  return sessionId;
}

function obtenerToken() {
  return localStorage.getItem("vortex_admin_token");
}

function headersAuth() {
  const token = obtenerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function estaAutenticado() {
  return !!obtenerToken();
}

export async function login(usuario, contrasena) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contrasena }),
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("vortex_admin_token", data.token);
  }
  return { ok: res.ok, data };
}

export function logout() {
  localStorage.removeItem("vortex_admin_token");
}

export async function obtenerEstado() {
  return solicitud("/health");
}

export async function obtenerProductos(categoriaId) {
  const query = categoriaId
    ? `?categoriaId=${encodeURIComponent(categoriaId)}`
    : "";
  return solicitud(`/productos${query}`);
}

export async function crearProducto(producto) {
  return solicitud("/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headersAuth() },
    body: JSON.stringify(producto),
  });
}

export async function actualizarProducto(id, producto) {
  return solicitud(`/productos/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headersAuth() },
    body: JSON.stringify(producto),
  });
}

export async function eliminarProducto(id) {
  return solicitud(`/productos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...headersAuth() },
  });
}

export async function obtenerCategorias() {
  return solicitud("/categorias");
}

export async function crearCategoria(categoria) {
  return solicitud("/categorias", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headersAuth() },
    body: JSON.stringify(categoria),
  });
}

export async function actualizarCategoria(id, categoria) {
  return solicitud(`/categorias/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...headersAuth() },
    body: JSON.stringify(categoria),
  });
}

export async function eliminarCategoria(id) {
  return solicitud(`/categorias/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { ...headersAuth() },
  });
}

export async function obtenerCarrito() {
  const sessionId = obtenerSessionId();
  return solicitud(`/carrito/${encodeURIComponent(sessionId)}`);
}

export async function agregarAlCarrito(productoId, cantidad = 1) {
  const sessionId = obtenerSessionId();
  return solicitud(`/carrito/${encodeURIComponent(sessionId)}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productoId, cantidad }),
  });
}

export async function actualizarCantidadCarrito(itemId, cantidad) {
  return solicitud(`/carrito/items/${encodeURIComponent(itemId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cantidad }),
  });
}

export async function eliminarDelCarrito(itemId) {
  return solicitud(`/carrito/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
}

export async function subirImagen(archivo) {
  const datos = new FormData();
  datos.append("imagen", archivo);
  const respuesta = await fetch(`${API_URL}/productos/imagen`, {
    method: "POST",
    headers: { Authorization: `Bearer ${obtenerToken()}` }, // NO pongas Content-Type
    body: datos,
  });
  const cuerpo = await respuesta.json();
  if (!respuesta.ok) throw new Error(cuerpo.mensaje || "No se pudo subir la imagen");
  return cuerpo;
}