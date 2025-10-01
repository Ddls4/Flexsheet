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
                    <q-input rounded standout v-model="form.username" label="Nombre" color="blue-grey-1 bg-blue-grey-6" />
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
                    <q-btn @click="RegistrarUsuario" label="Registrarse" rounded  color="blue-grey-10" style="width: 200px;" />
                    <p v-if="mensaje" class="q-mb-none q-mt-none">{{ mensaje }}</p>
                </q-card-actions>


            </q-card>
        </div>
    </q-page>

</template>

<script setup>
    import { ref } from 'vue'
    import { io } from 'socket.io-client'

    const socket = io(`http://${import.meta.env.VITE_P_IP}:80`)
    const isPwd = ref(true)
    const form = ref({ username: '', password: ''  })
    const mensaje = ref('')

    const RegistrarUsuario = () => {
        socket.emit('registrar', form.value);
        socket.on('registroResultado', (response) => {
        if (response.success) {
            mensaje.value = 'Usuario registrado con éxito';
            window.location.href = '/Login'; 
        } else {
            mensaje.value = response.message || 'Error al registrar usuario';
        }
        });
    }



</script>
