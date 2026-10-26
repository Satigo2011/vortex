<template>
  <div class="resumen" @click.self="$emit('cerrar')">
    <div class="resumen__panel" role="dialog" aria-modal="true" aria-labelledby="resumen-titulo">
      <header class="resumen__head">
        <h2 id="resumen-titulo">Resumen de tu pedido</h2>
        <button class="resumen__cerrar" @click="$emit('cerrar')" aria-label="Cerrar">×</button>
      </header>

      <ul class="resumen__lista">
        <li v-for="item in items" :key="item._id" class="resumen__item">
          <img v-if="item.imagen" :src="item.imagen" :alt="item.nombre" />
          <div v-else class="resumen__placeholder">V.</div>

          <div class="resumen__datos">
            <h3>{{ item.nombre }}</h3>
            <p v-if="item.descripcion">{{ item.descripcion }}</p>
            <p class="resumen__meta">
              Talla {{ item.talla }} · {{ item.color || "—" }} · {{ item.genero }}
            </p>
            <p class="resumen__meta">
              {{ item.cantidad }} × $ {{ item.precio.toLocaleString("es-CO") }}
            </p>
          </div>

          <strong>$ {{ (item.cantidad * item.precio).toLocaleString("es-CO") }}</strong>
        </li>
      </ul>

      <footer class="resumen__pie">
        <span>Total</span>
        <strong>$ {{ total.toLocaleString("es-CO") }}</strong>
      </footer>

      <p class="resumen__nota">Este es un resumen de tu selección. No se realiza ningún pago en línea.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
});
defineEmits(["cerrar"]);
</script>