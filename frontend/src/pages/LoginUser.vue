<template>
    <q-page class="flex flex-center bg-grey-2">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Login de Usuario</div>
                </q-card-section>

                <q-card-section>
                    <q-input filled v-model="form.name" label="Nombre" />
                </q-card-section>
                <q-card-section>
                    <q-input filled v-model="form.password" label="Contraseña" :type="showPassword ? 'text' : 'password'"  />
                </q-card-section>

                <q-card-actions>
                    <q-btn @click="registerUser" label="Enviar" color="primary" />
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

    const form = ref({ name: '' })
    const mensaje = ref('')

    const registerUser = async () => {
        try {
            const response = await axios.post('/register', form.value)
            mensaje.value = 'Usuario registrado con éxito' 
        } catch (error) {
        console.error('Error al registrar:', error.response?.data || error.message)
        mensaje.value = 'Error al registrar usuario' 
        }
    }

</script>
