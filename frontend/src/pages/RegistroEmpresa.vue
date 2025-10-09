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
                    <q-input rounded standout v-model="form.username" label="Nombre del Negocio" color="blue-grey-1 bg-blue-grey-6" />
                </q-card-section>
                <q-card-section>
                    <q-input rounded standout v-model="form.url_imagen" label="URL_Imagen" color="blue-grey-1 bg-blue-grey-6" />
                </q-card-section>
                <q-card-section>
                    <q-input rounded standout v-model="form.departamento" label="Departamento" color="blue-grey-1 bg-blue-grey-6" />
                </q-card-section>
                <q-card-section>
                    <q-input rounded standout v-model="form.ciudad" label="Ciudad" color="blue-grey-1 bg-blue-grey-6" />
                </q-card-section>


                <q-card-actions class="flex justify-around items-center" style="padding: 16px;">
                    <q-btn @click="RegistrarNegocio" label="Registrar Negocio" rounded  color="blue-grey-10" style="width: 200px;" />
                    <p v-if="mensaje" class="q-mb-none q-mt-none">{{ mensaje }}</p>
                </q-card-actions>


            </q-card>
        </div>
    </q-page>

</template>

<script setup>
    import { ref } from 'vue'
    import { io } from 'socket.io-client'

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id || '';

    const socket = io(`http://${import.meta.env.VITE_P_IP}:80`)
    const isPwd = ref(true)
    const form = ref({ 
        username: '', url_imagen: '',
        departamento: '',ciudad: '',
        usuario: userId})
    const mensaje = ref('')

    const RegistrarNegocio = () =>{
        socket.emit('crear_negocio', form.value, (response)=>{
            if (response.success){
                mensaje.value = 'Negocio registrado con éxito'
            } else{
                mensaje.value = response.message || 'Error al registrar Enpresa'
            }
        });
    }
</script>
