<template>
  <q-page class="flex flex-center bg-blue-grey-10">
    <div class="q-pa-md" style="max-width: 400px; width: 100%;">
      <q-card class="bg-blue-grey-8 text-white">

        <q-card-section>
          <div class="q-mb-md text-center" style="padding: 10px;">
            <label class="text-weight-bolder text-h2">AltaShop</label>
          </div>
        </q-card-section>

        <q-card-section class="text-center">
          <p class="text-h6 q-mb-md">
            ¿Estás seguro de que quieres transformar tu cuenta en una cuenta de empresa?
          </p>
          <p class="text-subtitle2">
            Esta acción permitirá crear y administrar negocios asociados a tu cuenta.
          </p>
        </q-card-section>

        <q-card-actions class="flex justify-around items-center q-mt-md">
          <q-btn 
            label="Sí, convertir cuenta" 
            color="positive" 
            rounded 
            @click="confirmarTransformacion"
          />
          <q-btn 
            label="Cancelar" 
            color="negative" 
            rounded 
            to="/perfil" 
          />
        </q-card-actions>

        <q-card-section v-if="mensaje" class="text-center">
          <p>{{ mensaje }}</p>
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { io } from 'socket.io-client'

// Obtener usuario del localStorage
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userId = storedUser.id || '';

// Conectar con el backend
const socket = io(`http://${import.meta.env.VITE_P_IP}:80`);
const mensaje = ref('');

// Función para confirmar la transformación de cuenta
const confirmarTransformacion = () => {
  if (!userId) {
    mensaje.value = "Error: no se encontró el usuario.";
    return;
  }

  if (confirm("¿Seguro que quieres convertir tu cuenta en una cuenta de empresa?")) {
    socket.emit('RegistroEmpresa', { userId }, (response) => {
      if (response.success) {
        mensaje.value = "✅ Tu cuenta ahora es una cuenta de empresa.";
      } else {
        mensaje.value = response.message || "❌ Error al actualizar tu cuenta.";
      }
    });
  }
};
</script>

<style scoped>
p {
  color: #fff;
}
</style>