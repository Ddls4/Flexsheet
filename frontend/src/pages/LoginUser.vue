<template>
    <q-page class="flex flex-center bg-blue-grey-10">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card class="bg-blue-grey-8 text-white">
                <q-card-section>
                    <div class="text-h6">Login de Usuario</div>
                </q-card-section>

                <q-card-section>
                    <q-input rounded standout v-model="form.username" label="Nombre" color="blue-grey-1 bg-blue-grey-6"/>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="form.password" rounded standout :type="isPwd ? 'password' : 'text'" label="Contraseña" color="blue-grey-1 bg-blue-grey-6">
                        <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                        </template>
                    </q-input>
                </q-card-section>

                

                <q-card-actions class="flex justify-around items-center" style="padding: 16px;">
                    <q-btn @click="LoginUser" label="Enviar" color="blue-grey-10" />
                     <p v-if="mensaje" class="q-mb-none q-mt-none">{{ mensaje }}</p>
                </q-card-actions>
            </q-card>
        </div>
    </q-page>

</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'

const isPwd = ref(true)
const form = ref({ username: '', password: '' })
const mensaje = ref('')

// Inicializa socket pero no conectes todavía
const socket = io(`http://${import.meta.env.VITE_P_IP}:80`, {
  withCredentials: true,
  autoConnect: false // Controlamos manualmente la conexión
})

const LoginUser = () => {
  axios.post(`http://${import.meta.env.VITE_P_IP}:80/login`, form.value, {
    withCredentials: true
  }).then(response => {
    if (response.data.success) {
      // Guardar usuario
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Ahora conectamos el socket después del login exitoso
      socket.connect();
      
      // Redirigir
      window.location.href = '/';
    }
  }).catch(error => {
    mensaje.value = error.response?.data?.message || 'Error al logear';
    console.error("Error en login:", error);
  });
}
</script>
