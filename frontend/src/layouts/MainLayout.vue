<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar class="bg-blue-grey-8 text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="flex">
          <div class="row items-center q-gutter-sm">
            <router-link to="/" class="flex items-center">
              <img
                src="~assets/AS_WB.svg"
                alt="Logo"
                style="height: 35px; width: 35px; background-color: white; border-radius: 10px; padding: 0px;"
              />
            </router-link>
          </div>
          <div class="text-weight-bolder text-h5 q-ml-sm">
            <q-btn label="Productos" icon="web_asset" color="blue-grey-6" :to="`/Menu`" />
          </div>
        </q-toolbar-title>

        <div v-if="$q.screen.gt.xs"> 
          <q-btn label="Registro" icon="playlist_add" color="blue-6" :to="`/Registro`" />
          <q-btn label="Login" icon="login" color="blue-6" :to="`/Login`" />
          <q-btn icon="shopping_cart" color="blue" @click="drawerCompras = true" round />
        </div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER LATERAL -->
    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      class="bg-blue-grey-8 text-white"
    >
      <div class="column full-height full-width q-pa-md">
        <div class="q-mb-md">
          <label class="text-weight-bolder text-h2">AltaShop</label>
        </div>

        <q-list separator class="q-mb-lg text-white">
          <q-item clickable>
            <q-item-section avatar><q-icon name="history" /></q-item-section>
            <q-item-section>Historial de compras</q-item-section>
          </q-item>

          <router-link to="/RegistroEmpresa" class="text-white">
            <q-item clickable>
              <q-item-section avatar><q-icon name="store" /></q-item-section>
              <q-item-section>Registrar comercio</q-item-section>
            </q-item>
          </router-link>

          <q-item clickable>
            <q-item-section avatar><q-icon name="settings" /></q-item-section>
            <q-item-section>Configuración</q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar><q-icon name="help" /></q-item-section>
            <q-item-section>Soporte</q-item-section>
          </q-item>

          <router-link to="/Tabla" class="text-white">
            <q-item clickable>
              <q-item-section avatar><q-icon name="table_view" /></q-item-section>
              <q-item-section>Tabla</q-item-section>
            </q-item>
          </router-link>

          <router-link to="/MenuEmpresa" class="text-white">
            <q-item clickable>
              <q-item-section avatar><q-icon name="inventory" /></q-item-section>
              <q-item-section>Menu de empresa</q-item-section>
            </q-item>
          </router-link>
        </q-list>

        <q-space />
        <div class="column q-gutter-md">
          <div class="row q-gutter-sm">
            <q-btn label="Registro" color="blue-grey-10" :to="`/Registro`" class="full-width q-mb-sm" />
            <q-btn label="Login" color="blue-grey-10" :to="`/Login`" class="full-width" />
          </div>
          <div class="q-mt-md text-caption">
            <div>Quasar: v{{ $q.version }}</div>
            <div>{{ socketId ? `ID: ${socketId}` : 'Sin ID' }}</div>
            <div>Socket Status: {{ socketConnected ? 'Conectado' : 'Desconectado' }}</div>
            <div>IP: {{ ip }}</div>
            <div>Tu ID es: {{ user }}</div>
            
            <q-badge
              :color="socketConnected ? 'green' : 'red'"
              class="q-ml-sm"
              style="height: 20px;"
            >
              {{ socketConnected ? 'Conectado' : 'Desconectado' }}
            </q-badge>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- DRAWER CARRITO -->
    <q-drawer v-model="drawerCompras" side="right" overlay>
      <div class="q-pa-md full-height column">
        <h5>🛒 Carrito de compra</h5>
        <div v-if="shoppingCart.length === 0">
          <q-banner dense class="bg-grey-3 text-grey-9">
            No hay productos en el carrito.
          </q-banner>
        </div>
        <q-list v-else bordered>
          <q-item v-for="(product, index) in shoppingCart" :key="index">
            <q-item-section avatar>
              <q-img :src="product.imagenURL" style="width: 50px; height: 50px;" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ product.title }}</q-item-label>
              <q-item-label caption>Precio: ${{ product.price }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />
        <div class="flex justify-center" style="margin: 5px;">
          <q-btn class="bg-blue-4">Comprar</q-btn>
        </div>
      </div>
    </q-drawer>

    <!-- PAGE CONTAINER -->
    <q-page-container @click="cerrarDrawerSiClicFuera">
      <!-- Botón de prueba para socket -->
      <button @click="enviarMensaje('Hola backend!')">
        Enviar mensaje
      </button>

      <router-view :socket="socket" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, provide, watch } from 'vue'
import { useRouter } from 'vue-router'
import { io } from "socket.io-client"

const router = useRouter()
const ip = import.meta.env.VITE_P_IP
const socket = ref(null)
const socketConnected = ref(false)
const socketId = ref(null)
const user = ref(null)

const leftDrawerOpen = ref(false)
const drawerCompras = ref(false)
const shoppingCart = ref([])

// Función para inicializar socket
const iniciarSocket = () => {
  const token = localStorage.getItem("token")
  console.log("🔑 Token encontrado:", token ? "Sí" : "No")
  
  if (!token) {
    console.warn("⚠️ No hay token, socket no se conectará")
    socketConnected.value = false
    socketId.value = null
    return
  }

  if (socket.value) {
    socket.value.disconnect()
    socket.value = null
  }

  socket.value = io(`http://${ip}:80`, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
  })

  socket.value.on('connect', () => {
    socketConnected.value = true
    socketId.value = socket.value.id
    console.log('✅ Conectado al servidor WebSocket con ID:', socket.value.id)
  })

  socket.value.on('disconnect', (reason) => {
    socketConnected.value = false
    socketId.value = null
    console.log('🔌 Desconectado del servidor WebSocket:', reason)
  })

  socket.value.on('connect_error', (error) => {
    console.error('❌ Error de conexión WebSocket:', error.message)
    socketConnected.value = false
    
    if (error.message.includes('Token') || error.message.includes('authorizado')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/Login')
    }
  })

  socket.value.on('mensaje_servidor', (data) => {
    console.log('Mensaje recibido del servidor:', data)
  })
}

// Watcher para cambios en el token
watch(() => localStorage.getItem("token"), (newToken) => {
  if (newToken) iniciarSocket()
  else if (socket.value) {
    socket.value.disconnect()
    socket.value = null
    socketConnected.value = false
    socketId.value = null
  }
})

// Inicializar al montar
onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try { user.value = JSON.parse(userData) } 
    catch (e) { console.error('Error parsing user data:', e) }
  }
  
  iniciarSocket()
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  if (socket.value) socket.value.disconnect()
})

const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
const enviarMensaje = (mensaje) => {
  if (socket.value && socketConnected.value) socket.value.emit('mensaje_cliente', mensaje)
  else console.warn('No se puede enviar mensaje: WebSocket no conectado')
}
function cerrarDrawerSiClicFuera() {
  drawerCompras.value = false
  leftDrawerOpen.value = false
}

// Proveer datos a hijos
provide('shoppingCart', shoppingCart)
provide('socket', socket)
provide('socketConnected', socketConnected)

// Exponer para otros componentes
defineExpose({ socket, socketConnected, socketId, enviarMensaje })
</script>
