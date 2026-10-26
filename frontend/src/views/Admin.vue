<script setup>
import { ref, onMounted } from "vue";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerCategorias,
  subirImagen,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  login,
  logout,
  estaAutenticado,
} from "../services/api";

const autenticado = ref(estaAutenticado());
const usuario = ref("");
const contrasena = ref("");
const errorLogin = ref("");
const error = ref("");
const aviso = ref("");
const pestana = ref("productos");
const guardando = ref(false);
const subiendoImagen = ref(false);
const archivoImagen = ref(null);
const vistaPrevia = ref("");

const productos = ref([]);
const categorias = ref([]);
const editandoId = ref(null);
const editandoCategoriaId = ref(null);

const formProducto = ref({
  nombre: "",
  descripcion: "",
  imagen: "",
  precio: 0,
  stock: 0,
  talla: "M",
  color: "",
  genero: "unisex",
  categoriaId: "",
});

const nuevaCategoria = ref({ nombre: "", descripcion: "" });

async function cargarDatos() {
  error.value = "";
  try {
    [productos.value, categorias.value] = await Promise.all([
      obtenerProductos(),
      obtenerCategorias(),
    ]);
  } catch (err) {
    error.value = err.message || "No se pudieron cargar los datos.";
  }
}

async function iniciarSesion() {
  errorLogin.value = "";
  try {
    const resultado = await login(usuario.value, contrasena.value);
    if (resultado.ok) {
      autenticado.value = true;
      await cargarDatos();
    } else {
      errorLogin.value =
        resultado.data.mensaje || "Revisa tus datos e inténtalo de nuevo.";
    }
  } catch {
    errorLogin.value = "No fue posible conectar con el servidor.";
  }
}

function cerrarSesion() {
  logout();
  autenticado.value = false;
  pestana.value = "productos";
}

function limpiarFormProducto() {
  formProducto.value = {
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: 0,
    stock: 0,
    talla: "M",
    color: "",
    genero: "unisex",
    categoriaId: "",
  };
  editandoId.value = null;
  archivoImagen.value = null;
  vistaPrevia.value = "";
}

function elegirImagen(evento) {
  const archivo = evento.target.files?.[0];
  if (!archivo) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
    error.value = "Solo se permiten imágenes JPG, PNG o WEBP.";
    evento.target.value = "";
    return;
  }
  if (archivo.size > 2 * 1024 * 1024) {
    error.value = "La imagen supera los 2 MB.";
    evento.target.value = "";
    return;
  }
  error.value = "";
  archivoImagen.value = archivo;
  vistaPrevia.value = URL.createObjectURL(archivo);
}

async function guardarProducto() {
  guardando.value = true;
  error.value = "";
  try {
    if (archivoImagen.value) {
      subiendoImagen.value = true;
      const { url } = await subirImagen(archivoImagen.value);
      formProducto.value.imagen = url;
    }
    if (editandoId.value) {
      await actualizarProducto(editandoId.value, formProducto.value);
      aviso.value = "Producto actualizado.";
    } else {
      await crearProducto(formProducto.value);
      aviso.value = "Producto agregado.";
    }
    limpiarFormProducto();
    await cargarDatos();
  } catch (err) {
    error.value = err.message || "No se pudo guardar el producto.";
  } finally {
    subiendoImagen.value = false;
    guardando.value = false;
  }
}

function editarProducto(producto) {
  editandoId.value = producto._id;
  archivoImagen.value = null;
  vistaPrevia.value = producto.imagen || "";
  formProducto.value = {
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    imagen: producto.imagen || "",
    precio: producto.precio,
    stock: producto.stock,
    talla: producto.talla,
    color: producto.color || "",
    genero: producto.genero,
    categoriaId: producto.categoriaId?._id || producto.categoriaId,
  };
}

async function borrarProducto(id) {
  if (!window.confirm("¿Eliminar este producto del catálogo?")) return;
  try {
    await eliminarProducto(id);
    aviso.value = "Producto eliminado.";
    await cargarDatos();
  } catch (err) {
    error.value = err.message || "No se pudo eliminar el producto.";
  }
}

function limpiarFormCategoria() {
  nuevaCategoria.value = { nombre: "", descripcion: "" };
  editandoCategoriaId.value = null;
}

async function guardarCategoria() {
  error.value = "";
  try {
    if (editandoCategoriaId.value) {
      await actualizarCategoria(
        editandoCategoriaId.value,
        nuevaCategoria.value,
      );
      aviso.value = "Categoría actualizada.";
    } else {
      await crearCategoria(nuevaCategoria.value);
      aviso.value = "Categoría agregada.";
    }
    limpiarFormCategoria();
    await cargarDatos();
  } catch (err) {
    error.value = err.message || "No se pudo guardar la categoría.";
  }
}

function editarCategoria(cat) {
  editandoCategoriaId.value = cat._id;
  nuevaCategoria.value = {
    nombre: cat.nombre,
    descripcion: cat.descripcion || "",
  };
}

async function borrarCategoria(id) {
  if (!window.confirm("¿Eliminar esta categoría?")) return;
  try {
    await eliminarCategoria(id);
    aviso.value = "Categoría eliminada.";
    await cargarDatos();
  } catch (err) {
    error.value = err.message || "No se pudo eliminar la categoría.";
  }
}

onMounted(() => {
  if (autenticado.value) cargarDatos();
});
</script>

<template>
  <section v-if="!autenticado" class="admin-login">
    <div class="login-brand-panel" aria-hidden="true">
      <span class="login-panel-label">VORTEX / CONTROL</span>
      <span class="login-panel-mark"><span>V</span><span>O</span></span>
      <span class="login-image-caption">TU MARCA. TU MOVIMIENTO.</span>
    </div>
    <div class="login-panel">
      <p class="eyebrow eyebrow-dark">ÁREA PRIVADA</p>
      <h1>Hola,<br /><span>bienvenido.</span></h1>
      <p class="login-intro">
        Administra la colección y mantén cada detalle en movimiento.
      </p>
      <form class="login-form" @submit.prevent="iniciarSesion">
        <label
          >Usuario<input
            v-model="usuario"
            autocomplete="username"
            placeholder="Tu usuario"
            required
        /></label>
        <label
          >Contraseña<input
            v-model="contrasena"
            type="password"
            autocomplete="current-password"
            placeholder="Tu contraseña"
            required
        /></label>
        <button class="button button-dark" type="submit">
          Entrar al panel <span aria-hidden="true">↗</span>
        </button>
      </form>
      <p v-if="errorLogin" class="notice notice-error" role="alert">
        {{ errorLogin }}
      </p>
    </div>
  </section>

  <section v-else class="admin-view">
    <div class="admin-topline">
      <div>
        <p class="eyebrow eyebrow-dark">VORTEX / CONTROL</p>
        <h1>Panel de <span>gestión.</span></h1>
      </div>
      <button class="text-button" type="button" @click="cerrarSesion">
        Cerrar sesión <span aria-hidden="true">↗</span>
      </button>
    </div>

    <div class="admin-stats">
      <div>
        <span>Productos</span
        ><strong>{{ productos.length.toString().padStart(2, "0") }}</strong>
      </div>
      <div>
        <span>Categorías</span
        ><strong>{{ categorias.length.toString().padStart(2, "0") }}</strong>
      </div>
      <div>
        <span>En stock</span
        ><strong>{{
          productos
            .filter((producto) => producto.stock > 0)
            .length.toString()
            .padStart(2, "0")
        }}</strong>
      </div>
    </div>

    <p v-if="aviso" class="notice notice-success" role="status">{{ aviso }}</p>
    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>

    <div class="admin-tabs" role="tablist" aria-label="Secciones del panel">
      <button
        :class="{ 'is-selected': pestana === 'productos' }"
        role="tab"
        :aria-selected="pestana === 'productos'"
        @click="pestana = 'productos'"
      >
        Inventario <span>{{ productos.length }}</span>
      </button>
      <button
        :class="{ 'is-selected': pestana === 'categorias' }"
        role="tab"
        :aria-selected="pestana === 'categorias'"
        @click="pestana = 'categorias'"
      >
        Categorías <span>{{ categorias.length }}</span>
      </button>
    </div>

    <div v-if="pestana === 'productos'" class="admin-workspace">
      <section class="admin-form-section">
        <p class="eyebrow eyebrow-dark">
          {{ editandoId ? "EDITAR REFERENCIA" : "NUEVA REFERENCIA" }}
        </p>
        <h2>{{ editandoId ? "Ajusta el producto." : "Añade una pieza." }}</h2>
        <form class="admin-form" @submit.prevent="guardarProducto">
          <label class="field-wide"
            >Nombre<input
              v-model="formProducto.nombre"
              placeholder="Ej. Camiseta Vortex"
              required
              maxlength="100"
          /></label>
          <label class="field-wide"
            >Descripción<input
              v-model="formProducto.descripcion"
              placeholder="Detalle breve de la prenda"
              maxlength="240"
          /></label>
          <div class="field-wide">
            <label for="imagen-producto">Imagen del producto</label>
            <input
              id="imagen-producto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="elegirImagen"
            />
            <small>JPG, PNG o WEBP · máx. 2 MB</small>
            <img
              v-if="vistaPrevia"
              :src="vistaPrevia"
              alt="Vista previa"
              style="max-width: 120px; margin-top: 0.5rem"
            />
          </div>
          <label
            >Precio<input
              v-model.number="formProducto.precio"
              type="number"
              min="0"
              step="1000"
              required
          /></label>
          <label
            >Unidades<input
              v-model.number="formProducto.stock"
              type="number"
              min="0"
              step="1"
              required
          /></label>
          <label
            >Color<input
              v-model="formProducto.color"
              placeholder="Negro"
              maxlength="40"
          /></label>
          <label
            >Talla<select v-model="formProducto.talla">
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select></label
          >
          <label
            >Género<select v-model="formProducto.genero">
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="unisex">Unisex</option>
            </select></label
          >
          <label class="field-wide"
            >Categoría<select v-model="formProducto.categoriaId" required>
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
                {{ cat.nombre }}
              </option>
            </select></label
          >
          <div class="form-actions field-wide">
            <button
              class="button button-dark"
              type="submit"
              :disabled="guardando"
            >
              {{
                guardando
                  ? subiendoImagen
                    ? "Subiendo imagen..."
                    : "Guardando..."
                  : editandoId
                    ? "Guardar cambios"
                    : "Publicar producto"
              }}
              <span aria-hidden="true">↗</span>
            </button>
            <button
              v-if="editandoId"
              class="text-button"
              type="button"
              @click="limpiarFormProducto"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="inventory-section">
        <div class="section-topline">
          <div>
            <p class="eyebrow eyebrow-dark">CATÁLOGO ACTIVO</p>
            <h2>Inventario</h2>
          </div>
          <span>{{ productos.length }} referencias</span>
        </div>
        <div v-if="productos.length" class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="producto in productos" :key="producto._id">
                <td data-label="Producto">
                  <div class="table-product">
                    <img
                      v-if="producto.imagen"
                      :src="producto.imagen"
                      :alt="producto.nombre"
                    />
                    <span>{{ producto.nombre }}</span>
                  </div>
                </td>
                <td data-label="Precio">
                  {{
                    new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(producto.precio)
                  }}
                </td>
                <td data-label="Stock">
                  <span
                    class="stock-pill"
                    :class="{ 'is-low': producto.stock < 4 }"
                    >{{ producto.stock }} uds.</span
                  >
                </td>
                <td data-label="Acciones">
                  <div class="row-actions">
                    <button type="button" @click="editarProducto(producto)">
                      Editar</button
                    ><button
                      type="button"
                      class="danger-action"
                      @click="borrarProducto(producto._id)"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="admin-empty">
          Aún no hay productos. Crea tu primera referencia.
        </p>
      </section>
    </div>

    <div v-else class="admin-workspace category-workspace">
      <section class="admin-form-section">
        <p class="eyebrow eyebrow-dark">ORGANIZA LA TIENDA</p>
        <h2>
          {{ editandoCategoriaId ? "Edita la categoría." : "Nueva categoría." }}
        </h2>
        <form class="admin-form" @submit.prevent="guardarCategoria">
          <label class="field-wide"
            >Nombre<input
              v-model="nuevaCategoria.nombre"
              placeholder="Ej. Básicos"
              required
              maxlength="80"
          /></label>
          <label class="field-wide"
            >Descripción<input
              v-model="nuevaCategoria.descripcion"
              placeholder="Una nota para el equipo"
              maxlength="180"
          /></label>
          <div class="form-actions field-wide">
            <button class="button button-dark" type="submit">
              {{
                editandoCategoriaId ? "Guardar categoría" : "Crear categoría"
              }}
              <span aria-hidden="true">↗</span></button
            ><button
              v-if="editandoCategoriaId"
              class="text-button"
              type="button"
              @click="limpiarFormCategoria"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
      <section class="inventory-section">
        <div class="section-topline">
          <div>
            <p class="eyebrow eyebrow-dark">NAVEGACIÓN DE TIENDA</p>
            <h2>Categorías</h2>
          </div>
          <span>{{ categorias.length }} en total</span>
        </div>
        <div v-if="categorias.length" class="category-list">
          <article
            v-for="cat in categorias"
            :key="cat._id"
            class="category-row"
          >
            <div>
              <h3>{{ cat.nombre }}</h3>
              <p>{{ cat.descripcion || "Sin descripción" }}</p>
            </div>
            <div class="row-actions">
              <button type="button" @click="editarCategoria(cat)">Editar</button
              ><button
                type="button"
                class="danger-action"
                @click="borrarCategoria(cat._id)"
              >
                Eliminar
              </button>
            </div>
          </article>
        </div>
        <p v-else class="admin-empty">
          Crea una categoría para empezar a organizar tus productos.
        </p>
      </section>
    </div>
  </section>
</template>