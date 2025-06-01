<template>
  <q-page class="flex flex-center">
    <q-input filled v-model="form.name" label="Nombre" />
    <q-btn @click="registerUser" label="Enviar" />
    <p v-if="mensaje">{{ mensaje }}</p> <!-- Aquí, se debe usar directamente `mensaje`, no `mensaje.value` -->
  </q-page>
</template>

<script setup>
  import { ref } from 'vue'
  import axios from 'axios'

  const form = ref({
    name: ''
  })

  const mensaje = ref('') // Definir la variable mensaje

const registerUser = async () => {
  try {
    const response = await axios.post('http://localhost:80/register', form.value)
    mensaje.value = 'Usuario registrado con éxito'
    console.log(response.data) // Ver la respuesta del servidor
  } catch (error) {
    console.error('Error al registrar:', error.response?.data || error.message)
    mensaje.value = 'Error al registrar usuario'
  }
}
</script>