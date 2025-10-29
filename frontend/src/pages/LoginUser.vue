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
                    <q-btn @click="LoginUser" label="Login" rounded  color="blue-grey-10" style="width: 200px;" />
                     <p v-if="mensaje" class="q-mb-none q-mt-none">{{ mensaje }}</p>
                </q-card-actions>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onBeforeUnmount, inject } from 'vue'
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

onBeforeUnmount(() => {
    if (socket.value) {
        socket.value.disconnect()
    }
})
</script>