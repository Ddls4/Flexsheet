<template>
<q-page class="flex flex-center bg-blue-grey-10 text-white">
  <div
    class="column items-center justify-center q-pa-xl"
    style="width: 100%; max-width: 900px; text-align: center; min-height: calc(100vh - 100px);"
  >
    <q-img
      src="~assets/bg-carwash-thum.webp"
      
      class="absolute-top-left"
      loading="eager"
      fetchpriority="high"
      style="opacity: 0.05; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
    />
    <!-- Título -->
    <div
      class="text-h1 text-weight-bolder q-mb-sm"
      style="
        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        background: linear-gradient(90deg, #fff, #cfd8dc);
        background-clip: text;             
        -webkit-background-clip: text;      
        -webkit-text-fill-color: transparent;
      "
    >
      Altashop
    </div>

      <!-- Subtítulo -->
      <div class="text-subtitle1 text-grey-2 q-mb-xl">
        Elegí el mejor lugar para lavar tu auto según tu tiempo <br>
        y preferencias, todo desde un solo lugar.
      </div>

      <!-- Botones tipo tarjeta -->
      <div class="row justify-center q-gutter-lg q-mb-xl">
        <q-card
          v-for="item in items"
          :key="item.label"
          class="bg-blue-grey-7 text-white q-pa-lg cursor-pointer transition-all"
          style="width: 180px; transform-origin: center;"
          @mouseover="hover = item.label"
          @mouseleave="hover = ''"
          @click="goTo(item.route)"
          :style="hover === item.label ? 'transform: scale(1.08);' : 'transform: scale(1);'"
        >
        <q-icon :name="item.icon" size="40px" class="q-mb-sm" />
          <div class="text-subtitle1 text-bold">{{ item.label }}</div>
        </q-card>
      </div>

      <!-- Texto descriptivo -->
      <div class="text-body1 text-grey-1 q-mx-md q-mb-md">
        Para comenzar, ingresá a la sección <strong>Productos</strong> para explorar nuestra tienda.
        Desde el menú de <strong>Opciones</strong> podés personalizar tu experiencia.
        Agregá los artículos que te gusten al carrito y descubrí una nueva forma de comprar.
      </div>

      <!-- Footer -->
      <div class="text-caption text-grey-2 q-mt-xl">
        © 2025 Altashop - Hecho con Quasar
      </div>

    </div>
  </q-page>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from "vue-router";

  const router = useRouter();
  const hover = ref("");

  const items = [
    { label: 'Productos', icon: 'store', route: "/Menu" },
    { label: 'Historial', icon: 'history', route: "/Tabla" },
    { label: 'Configuración', icon: 'settings', route: null }
  ]

  function goTo(route) {
    if (route) {
      router.push(route);
    } else {
      console.log("Ruta aún no disponible");
    }
  }

</script>

<style scoped>
.transition-all {
  transition: transform 0.25s ease-in-out;
}
</style>