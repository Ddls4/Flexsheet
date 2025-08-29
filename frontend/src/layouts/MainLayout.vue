<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class=" bg-blue-grey-8 text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="flex" >
          <div class="row items-center q-gutter-sm">
            <router-link to="/" class="flex items-center" >
              <img
                src="~assets/icon.svg"
                alt="Logo"
                style="height: 35px; width: 35px; background-color: white; border-radius: 10px; padding: 0px;"
              />
            </router-link>

            <q-badge
              :color="socketConnected ? 'green' : 'red'"
              class="q-ml-sm"
              style="height: 20px;"
            >
              {{ socketConnected ? 'Conectado' : 'Desconectado' }}
            </q-badge>
          </div>
          <div style="background-color: aqua;">
              <router-link to="/" class="flex items-center" >
                <label> papu</label>
              </router-link>
          </div>
        </q-toolbar-title>


        <div> 
          <q-btn label="Registro" color="blue-grey-10" :to="`/registro`" />
          <q-btn label="Login" color="blue-grey-10" :to="`/Login`" />
        </div>
        
      </q-toolbar>
    </q-header>
    
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="flex bg-blue-grey-8 text-white"
    >
        <div class="column items-start full-width" >
            <label class="text-weight-bolder text-h2" style="margin: 30px;"> AltaShop </label>
            <div class="col-9 full-width flex">
              <div class="column justify-around full-width">
                <label class="col"> Tus compras </label>
                <label class="col"> Registrar comercio</label>
                <label class="col"> Confirmación</label>
                <label class="col"> Soporte</label>
              </div>
            </div>
            <div class="col-2">

              <div class="col"> 
                <q-btn label="Registro" color="blue-grey-10" :to="`/registro`" />
                <q-btn label="Login" color="blue-grey-10" :to="`/Login`" />
              </div>

              <div>Quasar: v{{ $q.version }}</div>
              <div>{{ socketId ? `ID: ${socketId}` : 'Sin ID' }}</div>
              <div>Socket Status: {{ socketConnected ? 'Conectado' : 'Desconectado' }}</div>
              <div>IP: {{ ip }}</div>
          </div>


      </div>

     
    </q-drawer>
    

    <q-page-container>
      <!-- Pasa el socket a todas las páginas hijas -->
      <router-view :socket="socket" />
      
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { io } from "socket.io-client"

const ip = import.meta.env.VITE_P_IP;
const socket = ref(null)
const socketConnected = ref(false)
const socketId = ref(null)

const iniciarSocket=()=>{
  socket.value = io(`http://${import.meta.env.VITE_P_IP}:80`, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true
  })
}
iniciarSocket()

const leftDrawerOpen = ref(false)
  socket.value.on('connect', () => {
    socketConnected.value = true
    socketId.value = socket.value.id
    console.log('Conectado al servidor WebSocket con ID:', socket.value.id)
  })
  socket.value.on('disconnect', () => {
    socketConnected.value = false
    socketId.value = null
    console.log('Desconectado del servidor WebSocket')
  })
  socket.value.on('connect_error', (error) => {
    console.error('Error de conexión WebSocket:', error)
  })
  socket.value.on('mensaje_servidor', (data) => {
    console.log('Mensaje recibido del servidor:', data)
  })

// Limpiar el socket al desmontar el componente
const cleanupSocket = () => {
  if (socket.value) {
    socket.value.off('connect')
    socket.value.off('disconnect')
    socket.value.off('connect_error')
    socket.value.off('mensaje_servidor')
    socket.value.disconnect()
  }
}
// Limpiar al desmontar
onBeforeUnmount(() => {
  cleanupSocket()
})
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
// Función para enviar mensajes (puede ser usada desde otros componentes)
const enviarMensaje = (mensaje) => {
  if (socket.value && socketConnected.value) {
    socket.value.emit('mensaje_cliente', mensaje)
  } else {
    console.warn('No se puede enviar mensaje: WebSocket no conectado')
  }
}
// Exportar para usar en otros componentes si es necesario
defineExpose({
  socket,
  socketConnected,
  socketId,
  enviarMensaje
})
</script>