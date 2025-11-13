<template>
  <q-page class="flex flex-center bg-blue-grey-10 text-white">
    <div
      class="column items-center justify-center q-pa-xl"
      style="width: 100%; max-width: 900px; text-align: center; min-height: calc(100vh - 100px);"
    >
      <q-img
        src="~assets/bg-carwash.jpg"
        class="absolute-top-left"
        style="opacity: 0.04; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
      />

      <!-- Título -->
      <div
        class="text-h1 text-weight-bolder q-mb-sm"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.3); background: linear-gradient(90deg, #fff, #cfd8dc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
      >
        Altashop
      </div>

      <!-- Subtítulo -->
      <div class="text-subtitle1 text-grey-4 q-mb-xl">
        Elegí el mejor lugar para lavar tu auto según tu tiempo <br />
        y preferencias, todo desde un solo lugar.
      </div>

      <!-- Botones tipo tarjeta -->
      <div class="row justify-center q-gutter-lg q-mb-xl">
        <q-card
          v-for="item in items"
          :key="item.label"
          class="bg-blue-grey-7 text-white q-pa-lg cursor-pointer"
          style="width: 180px; transition: transform 0.2s;"
          @mouseover="hover = item.label"
          @mouseleave="hover = ''"
          :style="hover === item.label ? 'transform: scale(1.08);' : ''"
          @click="handleClick(item.label)"
        >
          <q-icon :name="item.icon" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1 text-bold">{{ item.label }}</div>
        </q-card>
      </div>

      <!-- Texto descriptivo -->
      <div class="text-body1 text-grey-3 q-mx-md q-mb-md">
        Para comenzar, ingresá a la sección <strong>Productos</strong> para explorar nuestra tienda.
        Desde el menú de <strong>Opciones</strong> podés personalizar tu experiencia.
        Agregá los artículos que te gusten al carrito y descubrí una nueva forma de comprar.
      </div>

      <!-- Footer -->
      <div class="text-caption text-grey-5 q-mt-xl">
        © 2025 Altashop - Hecho con Quasar
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";

const hover = ref("");
const items = [
  { label: "Productos", icon: "store" },
  { label: "Historial", icon: "history" },
  { label: "Configuración", icon: "settings" },
];

// Acceder al socket global
const { appContext } = getCurrentInstance();
const socket = appContext.config.globalProperties.$socket;

// Manejo de clicks en tarjetas
function handleClick(label) {
  console.log("Click en:", label);
  // Por ejemplo, emitimos un evento a backend si es necesario
  socket.emit("navegacion_click", { page: label });
}

// Recibir actualizaciones de pagos en tiempo real
onMounted(() => {
  socket.on("payment_update", (data) => {
    console.log("💰 Pago recibido:", data);
    // Podés actualizar UI o mostrar notificación
  });
});
</script>

<style scoped>
</style>
