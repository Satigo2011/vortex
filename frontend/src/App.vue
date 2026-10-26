<script setup>
import { ref, onMounted } from "vue";
import { obtenerEstado } from "./services/api";

const estadoApi = ref("Conectando");
const apiConectada = ref(false);

onMounted(async () => {
  try {
    const estado = await obtenerEstado();
    estadoApi.value =
      estado.estado === "ok" ? "Tienda en línea" : "API disponible";
    apiConectada.value = estado.estado === "ok";
  } catch {
    estadoApi.value = "API desconectada";
  }
});
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Vortex, ir al catálogo">
      <span class="brand-symbol" aria-hidden="true"
        ><span>V</span><span>O</span></span
      >
      <span class="brand-name">vortex<span>.</span></span>
    </RouterLink>

    <nav class="main-nav" aria-label="Navegación principal">
      <RouterLink to="/" exact-active-class="is-active">Tienda</RouterLink>
      <RouterLink to="/carrito" class="cart-link"
        >Carrito <span aria-hidden="true">↗</span></RouterLink
      >
    </nav>

    <div class="header-end">
      <span class="api-status" :class="{ 'is-online': apiConectada }">
        <span class="status-dot"></span>{{ estadoApi }}
      </span>
      <RouterLink
        class="admin-link"
        to="/admin"
        aria-label="Panel de administración"
        >Admin <span aria-hidden="true">↗</span></RouterLink
      >
    </div>
  </header>

  <main class="page-shell">
    <RouterView />
  </main>

  <footer class="site-footer">
    <RouterLink class="footer-brand" to="/">vortex<span>.</span></RouterLink>
    <span>Ropa para moverse a tu manera.</span>
    <span>© 2026 Vortex</span>
  </footer>
</template>
