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

        <q-toolbar-title class="" >
          <router-link to="/" >
            <img src="~assets/Captura-de-pantalla-2025-06-21-172759.svg" alt="Logo" style="height: 30px; width: 30px;" />
          </router-link>
          <q-badge :color="socketConnected ? 'green' : 'red'" class="q-ml-sm">
            {{ socketConnected ? 'Conectado' : 'Desconectado' }}
          </q-badge>
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
      class="bg-blue-grey-8 text-white "
    >
      <div>Quasar: v{{ $q.version }}</div>
      <div>Socket ID: {{ socketId }}</div>
      <div>Socket Status: {{ socketConnected ? 'Conectado' : 'Desconectado' }}</div>
      <div>IP: {{ ip }}</div>
     
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

  // Escuchar eventos personalizados del backend
  socket.value.on('mensaje_servidor', (data) => {
    console.log('Mensaje recibido del servidor:', data)
    // Aquí puedes manejar los mensajes entrantes
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