<script setup>
import { ref, reactive, onMounted } from "vue";
import { obtenerCarrito, eliminarDelCarrito } from "../services/api";

const metodos = ["Contra entrega", "Transferencia bancaria", "Pago en tienda"];

const items = ref([]);
const total = ref(0);
const cargando = ref(true);
const error = ref("");
const confirmado = ref(false);

const form = reactive({
  nombre: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  notas: "",
  metodoPago: "",
});
const errores = reactive({});

function formatoPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor || 0);
}

function validar() {
  Object.keys(errores).forEach((k) => delete errores[k]);
  if (form.nombre.length < 3) errores.nombre = "Escribe tu nombre completo";
  if (!/^[0-9+\s-]{7,15}$/.test(form.telefono))
    errores.telefono = "Teléfono no válido";
  if (form.direccion.length < 5) errores.direccion = "Escribe tu dirección";
  if (!form.ciudad) errores.ciudad = "Escribe tu ciudad";
  if (!form.metodoPago) errores.metodoPago = "Elige un método de pago";
  return Object.keys(errores).length === 0;
}

async function confirmar() {
  if (!validar()) return;
  error.value = "";
  try {
    // Vacía el carrito al confirmar el pedido
    await Promise.all(items.value.map((i) => eliminarDelCarrito(i._id)));
    confirmado.value = true;
  } catch (err) {
    error.value = err.message || "No se pudo registrar el pedido.";
  }
}

onMounted(async () => {
  try {
    const carrito = await obtenerCarrito();
    items.value = carrito.items || [];
    total.value = carrito.total || 0;
  } catch (err) {
    error.value = err.message || "No fue posible cargar tu pedido.";
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <section class="cart-view">
    <div class="page-title-row">
      <div>
        <p class="eyebrow eyebrow-dark">DETALLE DE COMPRA</p>
        <h1>Casi listo<span>.</span></h1>
      </div>
      <RouterLink class="text-link" to="/carrito"
        >Volver al carrito <span aria-hidden="true">↗</span></RouterLink
      >
    </div>

    <p v-if="error" class="notice notice-error" role="alert">{{ error }}</p>

    <!-- Pedido confirmado -->
    <div v-if="confirmado" class="empty-state">
      <span class="empty-mark">V.</span>
      <h2>¡Pedido registrado!</h2>
      <p>
        Lo enviaremos a {{ form.direccion }}, {{ form.ciudad }}.<br />
        Método de pago: {{ form.metodoPago }}.
      </p>
      <RouterLink class="button button-dark" to="/"
        >Volver a la tienda <span aria-hidden="true">↗</span></RouterLink
      >
    </div>

    <p v-else-if="cargando" class="empty-state">Cargando tu pedido...</p>

    <!-- Carrito vacío -->
    <div v-else-if="!items.length" class="empty-state">
      <span class="empty-mark">V.</span>
      <h2>Tu carrito está vacío</h2>
      <p>Agrega prendas para continuar con tu compra.</p>
      <RouterLink class="button button-dark" to="/"
        >Ir a la tienda <span aria-hidden="true">↗</span></RouterLink
      >
    </div>

    <div v-else class="cart-layout">
      <!-- Datos de entrega y pago -->
      <form class="admin-form" novalidate @submit.prevent="confirmar">
        <label class="field-wide">
          Nombre completo
          <input v-model.trim="form.nombre" type="text" autocomplete="name" />
          <small v-if="errores.nombre" class="field-error">{{
            errores.nombre
          }}</small>
        </label>

        <label>
          Teléfono
          <input v-model.trim="form.telefono" type="tel" autocomplete="tel" />
          <small v-if="errores.telefono" class="field-error">{{
            errores.telefono
          }}</small>
        </label>

        <label>
          Ciudad
          <input
            v-model.trim="form.ciudad"
            type="text"
            autocomplete="address-level2"
          />
          <small v-if="errores.ciudad" class="field-error">{{
            errores.ciudad
          }}</small>
        </label>

        <label class="field-wide">
          Dirección
          <input
            v-model.trim="form.direccion"
            type="text"
            autocomplete="street-address"
          />
          <small v-if="errores.direccion" class="field-error">{{
            errores.direccion
          }}</small>
        </label>

        <label class="field-wide">
          Indicaciones (opcional)
          <textarea
            v-model.trim="form.notas"
            rows="2"
            maxlength="200"
          ></textarea>
        </label>

        <fieldset class="field-wide pay-options">
          <legend>Método de pago</legend>
          <label v-for="m in metodos" :key="m" class="pay-option">
            <input
              v-model="form.metodoPago"
              type="radio"
              name="pago"
              :value="m"
            />
            {{ m }}
          </label>
          <small v-if="errores.metodoPago" class="field-error">{{
            errores.metodoPago
          }}</small>
        </fieldset>

        <div class="form-actions field-wide">
          <button type="submit" class="button button-dark">
            Confirmar pedido <span aria-hidden="true">↗</span>
          </button>
        </div>
      </form>

      <!-- Resumen -->
      <aside class="order-summary">
        <p class="eyebrow eyebrow-dark">RESUMEN</p>
        <h2>Tu pedido</h2>

        <div
          v-for="(item, indice) in items"
          :key="item._id"
          class="summary-item"
        >
          <div class="cart-product-mark" :class="`tone-${indice % 4}`">
            <img
              v-if="item.productoId?.imagen"
              :src="item.productoId.imagen"
              :alt="item.productoId.nombre"
            />
            <template v-else>V.</template>
          </div>
          <div>
            <h3>{{ item.productoId?.nombre || "Producto Vortex" }}</h3>
            <p>
              {{ item.productoId?.color || "Colección Vortex" }}
              <span>·</span> Talla {{ item.productoId?.talla || "M" }}
            </p>
            <p>{{ item.cantidad }} × {{ formatoPrecio(item.precioUnitario) }}</p>
          </div>
          <strong>{{
            formatoPrecio(item.precioUnitario * item.cantidad)
          }}</strong>
        </div>

        <div class="summary-line">
          <span>Envío</span><span>Se coordina contigo</span>
        </div>
        <div class="summary-total">
          <span>Total</span><strong>{{ formatoPrecio(total) }}</strong>
        </div>
        <p class="summary-note">
          Sin pago en línea: el pago se acuerda según el método elegido.
        </p>
      </aside>
    </div>
  </section>
</template>