<template>
    <q-page class="flex flex-center bg-blue-grey-10">
        <div class="q-pa-md" style="max-width: 400px; width: 100%;">
            <q-card class="bg-blue-grey-8 text-white">
                <q-card-section>
                    <div class="q-mb-md text-center" style="padding: 10px;">
                        <label class="text-weight-bolder text-h2">AltaShop</label>
                    </div> 
                </q-card-section>

                <q-card-section>
                    <q-input rounded standout v-model="form.username" label="Nombre" color="blue-grey-1 bg-blue-grey-6"
                    maxlength="50"/>
                </q-card-section>
                <q-card-section>
                    <q-input v-model="form.password" rounded standout :type="isPwd ? 'password' : 'text'" label="Contraseña" color="blue-grey-1 bg-blue-grey-6"
                        :rules="[
                        val => !!val || 'La contraseña es obligatoria',
                        val => val.length >= 6 || 'Mínimo 6 caracteres',
                        val => val.length <= 20 || 'Máximo 20 caracteres',
                        val => /[A-Z]/.test(val) || 'Debe tener al menos una letra mayúscula',
                        val => /[a-z]/.test(val) || 'Debe tener al menos una letra minúscula',
                        val => /\d/.test(val) || 'Debe tener al menos un número',
                        val => /[@$!%*?&.#]/.test(val) || 'Debe tener al menos un carácter especial (@, $, !, %, *, ?, &, ., #)'
                        ]" 
                        maxlength="30"
                    >
                        <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                        </template>
                    </q-input>
                </q-card-section>
                                <q-card-section>
                <div v-if="!allValid && form.password" class="q-mt-md">
                    <div
                        v-for="(req, index) in passwordRequirements"
                        :key="index"
                        class="text-caption row items-center"
                    >
                        <q-icon
                        :name="req.valid ? 'check_circle' : 'cancel'"
                        :color="req.valid ? 'positive' : 'negative'"
                        size="16px"
                        class="q-mr-sm"
                        />
                        <span :class="req.valid ? 'text-positive' : 'text-negative'">
                        {{ req.label }}
                        </span>
                    </div>
                </div>
                </q-card-section>

                <q-card-actions class="flex justify-around items-center" style="padding: 16px;">
                    <q-btn @click="LoginUser" label="Login" rounded  color="blue-grey-10" style="width: 200px;" />
                     <p v-if="mensaje" class="q-mb-none q-mt-none">{{ mensaje }}</p>
                </q-card-actions>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { io } from 'socket.io-client'

const router = useRouter()
const isPwd = ref(true)
const form = ref({ username: '', password: '' })
const mensaje = ref('')
const socket = ref(null)

const LoginUser = () => {
    socket.value = io(`http://${import.meta.env.VITE_P_IP}:80`, {
        reconnection: false,
        timeout: 10000
    })

    socket.value.on('connect', () => {
        console.log('✅ Socket conectado para login')
        
        socket.value.emit('login', form.value, (response) => {
            console.log('Respuesta del login:', response)
            
            if (response.success) {
                localStorage.setItem('token', response.token)
                localStorage.setItem('user', JSON.stringify(response.user))
                
                // 🔄 FORZAR RECARGA para que MainLayout se reconecte
                window.location.href = '/'
            } else {
                mensaje.value = response.message || 'Error al logear'
                socket.value.disconnect()
            }
        })
    })

    socket.value.on('connect_error', (error) => {
        console.error('❌ Error conectando socket:', error)
        mensaje.value = 'Error de conexión con el servidor'
    })
}

    const passwordRequirements = computed(() => {
        const val = form.value.password;

        return [
            { label: 'Mínimo 6 caracteres', valid: val.length >= 6,},
            { label: 'Máximo 20 caracteres', valid: val.length <= 20 && val.length > 0,},
            { label: 'Una letra mayúscula', valid: /[A-Z]/.test(val),},
            { label: 'Una letra minúscula', valid: /[a-z]/.test(val),},
            { label: 'Un número', valid: /\d/.test(val),},
            { label: 'Un carácter especial (@, $, !, %, *, ?, &, ., #)', valid: /[@$!%*?&.#]/.test(val),},
        ];
        });
    const allValid = computed(() => passwordRequirements.value.every(req => req.valid));

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.disconnect()
    }
})
</script>

<style scoped>
.text-positive {
  color: #4caf50; /* verde */
}

.text-negative {
  color: #f44336; /* rojo */
}
</style>