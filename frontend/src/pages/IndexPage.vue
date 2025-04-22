<template>
  <q-page class="flex flex-center">
    <q-btn @click="obtenerSaludo" label="Obtener Saludo" />
    <p v-if="mensaje">{{ mensaje }}</p>
  </q-page>
</template>

<script setup>

</script>