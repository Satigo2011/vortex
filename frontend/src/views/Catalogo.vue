<script setup>
import { computed, ref, onMounted } from "vue";
import {
  obtenerProductos,
  obtenerCategorias,
  agregarAlCarrito,
} from "../services/api";

const imagenesFallidas = ref({});
const productos = ref([]);
const categorias = ref([]);
const categoriaSeleccionada = ref("");
const busqueda = ref("");
const mensaje = ref("");
const error = ref("");
const cargando = ref(true);
const agregandoId = ref("");

const productosFiltrados = computed(() => {
  const termino = busqueda.value.trim().toLocaleLowerCase("es");
  if (!termino) return productos.value;
  return productos.value.filter((producto) =>
    [producto.nombre, producto.color, producto.descripcion]
      .filter(Boolean)
      .some((dato) => dato.toLocaleLowerCase("es").includes(termino)),
  );
});

async function cargarProductos() {
  cargando.value = true;
  error.value = "";
  try {
    productos.value = await obtenerProductos(
      categoriaSeleccionada.value || undefined,
    );
  } catch (err) {
    error.value = err.message || "No fue posible cargar el catálogo.";
  } finally {
    cargando.value = false;
  }
}

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

async function agregar(producto) {
  agregandoId.value = producto._id;
  error.value = "";
  try {
    await agregarAlCarrito(producto._id, 1);
    mensaje.value = `${producto.nombre} se agregó al carrito`;
    window.setTimeout(() => (mensaje.value = ""), 2600);
  } catch (err) {
    error.value = err.message || "No se pudo agregar el producto.";
  } finally {
    agregandoId.value = "";
  }
}

onMounted(async () => {
  try {
    categorias.value = await obtenerCategorias();
  } catch (err) {
    error.value = err.message || "No fue posible cargar las categorías.";
  }
  await cargarProductos();
});
</script>

<template>
  <section class="catalog-view">
    <div class="store-hero">
      <div class="hero-copy">
        <p class="eyebrow">
          <span class="eyebrow-line"></span> VORTEX / NUEVA TEMPORADA
        </p>
        <h1>Viste el ritmo<br /><span>que llevas dentro.</span></h1>
        <p class="hero-description">
          Prendas esenciales con carácter. Diseñadas para moverse contigo, todos
          los días.
        </p>
        <a class="button button-light" href="#productos"
          >Explorar colección <span aria-hidden="true">↓</span></a
        >
      </div>
      <div class="hero-mark-panel" aria-hidden="true">
        <span class="hero-panel-label">VORTEX / EST. 2026</span>
        <span class="hero-panel-mark"><span>V</span><span>O</span></span>
        <span class="hero-panel-note"
          >MOVE IN<br />YOUR OWN<br />DIRECTION.</span
        >
      </div>
      <div class="hero-index" aria-hidden="true">01 — 04</div>
    </div>

    <div class="catalog-heading" id="productos">
      <div>
        <p class="eyebrow eyebrow-dark">SELECCIÓN VORTEX</p>
        <h2>Encuentra tu <span>pieza.</span></h2>
      </div>
      <p class="catalog-count">
        {{ productosFiltrados.length }}
        {{ productosFiltrados.length === 1 ? "producto" : "productos" }}
      </p>
    </div>

    <div class="catalog-tools">
      <label class="search-field">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input
          v-model="busqueda"
          type="search"
          placeholder="Buscar prendas"
          aria-label="Buscar productos"
        />
      </label>
      <label class="filter-field">
        <span>Filtrar por</span>
        <select
          v-model="categoriaSeleccionada"
          @change="cargarProductos"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
            {{ cat.nombre }}
          </option>
        </select>
      </label>
    </div>

    <p v-if="mensaje" class="notice notice-success" role="status">
      {{ mensaje }}
    </p>
    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
    <p v-if="cargando" class="empty-state">Cargando colección...</p>
    <div v-else-if="productosFiltrados.length" class="product-grid">
      <article
        v-for="(producto, indice) in productosFiltrados"
        :key="producto._id"
        class="product-card"
      >
        <div
          class="product-art"
          :class="`tone-${indice % 4}`"
        >
          <img
            v-if="producto.imagen && !imagenesFallidas[producto._id]"
            class="product-art-image"
            :src="producto.imagen"
            :alt="producto.nombre"
            loading="lazy"
            @error="imagenesFallidas[producto._id] = true"
          />
          <span v-else class="product-art-mark">V.</span>
          <span class="product-art-caption">VORTEX / 2026</span>
          <span class="product-tag">{{
            producto.stock > 0 ? "Disponible" : "Agotado"
          }}</span>
          <span class="product-number"
            >V / {{ String(indice + 1).padStart(2, "0") }}</span
          >
        </div>
        <div class="product-info">
          <div class="product-title-row">
            <h3>{{ producto.nombre }}</h3>
            <span class="product-price">{{
              formatoPrecio(producto.precio)
            }}</span>
          </div>
          <p class="product-meta">
            {{ producto.color || "Vortex essential" }} <span>·</span> Talla
            {{ producto.talla }}
          </p>
          <button
            class="add-button"
            type="button"
            :disabled="producto.stock < 1 || agregandoId === producto._id"
            @click="agregar(producto)"
          >
            {{
              agregandoId === producto._id
                ? "Agregando..."
                : producto.stock > 0
                  ? "Añadir al carrito"
                  : "Sin existencias"
            }}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">
      <span class="empty-mark">V.</span>
      <h3>
        {{
          productos.length
            ? "No encontramos esa prenda."
            : "La colección se está preparando."
        }}
      </h3>
      <p>
        {{
          productos.length
            ? "Prueba con otro término o categoría."
            : "Muy pronto encontrarás aquí las piezas Vortex."
        }}
      </p>
    </div>
  </section>
</template>