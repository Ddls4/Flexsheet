<template>

  <q-page class="flex flex-center bg-blue-grey-10 text-white q-pa-md" >
    <div class="column q-pa-md bg-blue-grey-10 text-white " style="width: 100%; height: 100dvh; ">

      <!-- Sección de bienvenida -->
      <div class="col-6 col-md-5 bg-blue-grey-7 q-pa-lg q-rounded-borders shadow-2 ">
        <div class="text-center q-mb-md">
          <q-label class="text-h1 text-weight-bolder text-white">AltaShop</q-label>
        </div>
        <div class="text-body1 q-mx-lg text-justify" style="margin-top: 50px;" >   
          Elegí el mejor lugar para lavar tu auto según tu tiempo y preferencias, todo desde un solo lugar.
        </div>
      </div>
      <!-- Sección de instrucciones -->
      <div class="col-6 col-md-5 bg-blue-grey-8 q-pa-lg q-rounded-borders shadow-2">
        <div class="text-body1 text-justify q-mb-md" style="margin: 50px;">   
          Para comenzar, ingresá a la sección <strong>Productos</strong> para explorar nuestra tienda.  
          Desde el menú de <strong>Opciones</strong> podés personalizar tu experiencia.  
          Agregá los artículos que te gusten al carrito y descubrí una nueva forma de comprar.
        </div>
        <!-- Información del usuario -->
        <div v-if="user" class="bg-blue-grey-6 q-pa-md q-mt-md q-rounded-borders shadow-1 text-center">
          <h5 class="text-white text-weight-bold q-mb-xs">Bienvenido, {{ user.nombre }}</h5>
          <p class="text-caption text-grey-3">Tu ID es: {{ user.id }}</p>
        </div>

        <q-banner v-else type="warning" color="amber-7" class="q-mt-md text-center text-dark">
          No hay usuario logueado
        </q-banner> 
      </div>

    </div>

  </q-page>

</template>

<script setup>
  import { ref, onMounted } from 'vue';

  const user = ref(null);

  onMounted(() => {
    const data = localStorage.getItem('user');
    if (data) {
      try {
        user.value = JSON.parse(data);
      } catch (e) {
        console.error('Error al leer localStorage:', e);
      }
    }
  });
  </script>

<style>
.border {
  border: 2px solid transparent;
  border-radius: 4px;
}

.border-primary {
  border-color: #027be3; /* color azul de Quasar */
}
</style>