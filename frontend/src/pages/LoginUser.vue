<template>
    <q-page class="flex flex-center bg-blue-grey-10">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card class="bg-blue-grey-8 text-white">
                <q-card-section>
                    <div class="text-h6">Login de Usuario</div>
                </q-card-section>

                <q-card-section>
                    <q-input filled v-model="form.username" label="Nombre" color="blue-grey-1 bg-blue-grey-6"/>
                </q-card-section>
                <q-card-section>
                    <q-input filled v-model="form.password" label="Contraseña" color="blue-grey-1 bg-blue-grey-6" />
                </q-card-section>

                <q-card-actions>
                    <q-btn @click="LoginUser" label="Enviar" color="blue-grey-10" />
                </q-card-actions>

                <q-card-section v-if="mensaje">
                    <p>{{ mensaje }}</p>
                </q-card-section>
            </q-card>
        </div>
    </q-page>

</template>

<script setup>
    import { ref } from 'vue'
    import axios from 'axios'

    const form = ref({ username: '', password: ''  })
    const mensaje = ref('')

    const LoginUser = async () => {
        try {
            const response = await axios.post(`http://${import.meta.env.VITE_P_IP}:80/login`, form.value, { withCredentials: true });
            if (response.data.success) {
                mensaje.value = 'Usuario logeado con éxito';
                // Guardar los datos del usuario en localStorage o en el estado de la aplicación
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Redirigir al usuario a la página principal o dashboard
                window.location.href = '/'; // Ajusta la ruta según tu aplicación
            }
        } catch (error) {
            console.error('Error al registrar:', error.response?.data || error.message);
            mensaje.value = 'Error al logear al usuario';
        }
    }


</script>
