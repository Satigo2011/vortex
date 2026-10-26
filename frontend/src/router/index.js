import { createRouter, createWebHistory } from "vue-router";
import Catalogo from "../views/Catalogo.vue";
import Carrito from "../views/Carrito.vue";
import Admin from "../views/Admin.vue";
import DetalleCompra from "../views/DetalleCompra.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "catalogo", component: Catalogo },
    { path: "/carrito", name: "carrito", component: Carrito },
    { path: "/compra", name: "compra", component: DetalleCompra },
    { path: "/admin", name: "admin", component: Admin },
  ],
});

export default router;
