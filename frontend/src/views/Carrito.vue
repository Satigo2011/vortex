<script setup>
import { ref, onMounted } from "vue";
import {
  obtenerCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
} from "../services/api";

const items = ref([]);
const total = ref(0);
const cargando = ref(true);
const error = ref("");
const actualizandoId = ref("");

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

async function cargarCarrito() {
  cargando.value = true;
  error.value = "";
  try {
    const carrito = await obtenerCarrito();
    items.value = carrito.items || [];
    total.value = carrito.total || 0;
  } catch (err) {
    error.value = err.message || "No fue posible cargar tu carrito.";
  } finally {
    cargando.value = false;
  }
}

async function cambiarCantidad(item, nuevaCantidad) {
  if (nuevaCantidad < 1) return;
  actualizandoId.value = item._id;
  try {
    await actualizarCantidadCarrito(item._id, nuevaCantidad);
    await cargarCarrito();
  } catch (err) {
    error.value = err.message || "No se pudo actualizar la cantidad.";
  } finally {
    actualizandoId.value = "";
  }
}

async function quitar(item) {
  actualizandoId.value = item._id;
  try {
    await eliminarDelCarrito(item._id);
    await cargarCarrito();
  } catch (err) {
    error.value = err.message || "No se pudo quitar el producto.";
  } finally {
    actualizandoId.value = "";
  }
}

onMounted(cargarCarrito);
</script>

<template>
  <section class="cart-view">
    <div class="page-title-row">
      <div>
        <p class="eyebrow eyebrow-dark">TU SELECCIÓN</p>
        <h1>El carrito<span>.</span></h1>
      </div>
      <RouterLink class="text-link" to="/"
        >Seguir explorando <span aria-hidden="true">↗</span></RouterLink
      >
    </div>

    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>
    <p v-if="cargando" class="empty-state">Cargando tu selección...</p>

    <div v-else-if="items.length" class="cart-layout">
      <div class="cart-items">
        <div class="cart-column-labels">
          <span>Producto</span><span>Precio</span><span>Cantidad</span
          ><span>Total</span>
        </div>
        <article
          v-for="(item, indice) in items"
          :key="item._id"
          class="cart-item"
        >
          <div class="cart-product">
            <div
              class="cart-product-mark"
              :class="`tone-${indice % 4}`"
              aria-hidden="true"
            >
              V.
            </div>
            <div>
              <h2>{{ item.productoId?.nombre || "Producto Vortex" }}</h2>
              <p>
                {{ item.productoId?.color || "Colección Vortex" }}
                <span>·</span> Talla {{ item.productoId?.talla || "M" }}
              </p>
              <button
                class="remove-button"
                type="button"
                :disabled="actualizandoId === item._id"
                @click="quitar(item)"
              >
                Quitar
              </button>
            </div>
          </div>
          <span class="cart-unit-price">{{
            formatoPrecio(item.precioUnitario)
          }}</span>
          <div
            class="quantity-control"
            :aria-label="`Cantidad: ${item.cantidad}`"
          >
            <button
              type="button"
              :disabled="item.cantidad <= 1 || actualizandoId === item._id"
              aria-label="Reducir cantidad"
              @click="cambiarCantidad(item, item.cantidad - 1)"
            >
              −
            </button>
            <span>{{ item.cantidad }}</span>
            <button
              type="button"
              :disabled="actualizandoId === item._id"
              aria-label="Aumentar cantidad"
              @click="cambiarCantidad(item, item.cantidad + 1)"
            >
              +
            </button>
          </div>
          <strong class="cart-line-total">{{
            formatoPrecio(item.precioUnitario * item.cantidad)
          }}</strong>
        </article>
      </div>

      <aside class="order-summary">
        <p class="eyebrow eyebrow-dark">RESUMEN</p>
        <h2>Tu pedido</h2>
        <div class="summary-line">
          <span>Productos</span><span>{{ items.length }}</span>
        </div>
        <div class="summary-line">
          <span>Envío</span><span>Se calcula al finalizar</span>
        </div>
        <div class="summary-total">
          <span>Total parcial</span><strong>{{ formatoPrecio(total) }}</strong>
        </div>
        <button
          class="button button-dark"
          type="button"
          disabled
          title="La compra en línea estará disponible próximamente"
        >
          Finalizar compra <span aria-hidden="true">↗</span>
        </button>
        <p class="summary-note">
          Los pagos en línea estarán disponibles próximamente.
        </p>
      </aside>
    </div>

    <div v-else class="empty-state cart-empty">
      <span class="empty-mark">V.</span>
      <h2>Tu carrito está esperando.</h2>
      <p>Las buenas piezas no se encuentran solas.</p>
      <RouterLink class="button button-dark" to="/"
        >Ir a la tienda <span aria-hidden="true">↗</span></RouterLink
      >
    </div>
  </section>
</template>
