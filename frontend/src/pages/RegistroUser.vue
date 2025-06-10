<template>
    <q-page class="flex flex-center bg-grey-2">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Registro de Usuario</div>
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

    const form = ref({
        name: ''
    })

    const mensaje = ref('') // Definir la variable mensaje

</script>
