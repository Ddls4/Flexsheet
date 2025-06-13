<template>
    <q-page class="flex flex-center bg-grey-2">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Login de Usuario</div>
                </q-card-section>

                <q-card-section>
                    <q-input filled v-model="form.username" label="Nombre" />
                </q-card-section>
                <q-card-section>
                    <q-input filled v-model="form.password" label="Contraseña"  />
                </q-card-section>

                <q-card-actions>
                    <q-btn @click="LoginUser" label="Enviar" color="primary" />
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
            const response = await axios.post('http://localhost:80/login', form.value, { withCredentials: true });
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
