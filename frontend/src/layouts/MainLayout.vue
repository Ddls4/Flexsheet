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
                src="~assets/AS_WB.svg"
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
          <div class="text-weight-bolder text-h5 q-ml-sm " >
              <router-link to="/Menu" class="flex items-center text-white" >
                <label> Productos</label>
              </router-link>
          </div>
        </q-toolbar-title>


        <div v-if="$q.screen.gt.xs"> 
          <q-btn label="Registro" color="blue-6" :to="`/Registro`" />
          <q-btn label="Login" color="blue-grey-10" :to="`/Login`" />
          <q-btn label="Tienda" color="blue-grey" @click="drawerCompras = true" />
        </div>
        
      </q-toolbar>
    </q-header>
    
    <!-- Drawer del Memu lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      class="bg-blue-grey-8 text-white"
    >
      <div class="column full-height full-width q-pa-md " >

        <div class="q-mb-md">
            <label class="text-weight-bolder text-h2">AltaShop</label>
        </div>
        <!--
        <div class="column items-center q-gutter-md q-mb-lg text-center">
          <div class="text-subtitle1 text-weight-medium" style="letter-spacing: 0.5px;">Historial de compras</div>
          <div class="text-subtitle1 text-weight-medium" style="letter-spacing: 0.5px;">Registrar comercio</div>
          <div class="text-subtitle1 text-weight-medium" style="letter-spacing: 0.5px;">Configuración</div>
          <div class="text-subtitle1 text-weight-medium" style="letter-spacing: 0.5px;">Soporte</div>

          <router-link to="/Tabla" class="text-white text-subtitle1 text-weight-medium" style="letter-spacing: 0.5px;">
            Tabla
          </router-link>
          <router-link to="/MenuEmpresa" class="text-white text-subtitle1 text-weight-medium text-center" style="letter-spacing: 0.5px;">
            Menu de empresa (tus artículos)
          </router-link>
        </div>
      -->


      <q-list separator class="q-mb-lg text-white">
        <q-item clickable>
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section>Historial de compras</q-item-section>
        </q-item>

        <q-item clickable>
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Registrar comercio</q-item-section>
        </q-item>

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
         <div class="column q-gutter-md ">
            <div class="row q-gutter-sm ">
              <q-btn label="Registro" color="blue-grey-10" :to="`/registro`" class="full-width q-mb-sm" />
              <q-btn label="Login" color="blue-grey-10" :to="`/Login`" class="full-width" />
            </div>
            <div class="q-mt-md text-caption">
              <div>Quasar: v{{ $q.version }}</div>
              <div>{{ socketId ? `ID: ${socketId}` : 'Sin ID' }}</div>
              <div>Socket Status: {{ socketConnected ? 'Conectado' : 'Desconectado' }}</div>
              <div>IP: {{ ip }}</div>
            </div>
        </div>

      </div> 
    </q-drawer>
    
    
    <!-- Drawer del carrito -->
    <q-drawer v-model="drawerCompras" side="right" overlay>
      <div class="q-pa-md">
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
      </div>
    </q-drawer>

    <q-page-container @click="cerrarDrawerSiClicFuera">
      <!-- Pasa el socket a todas las páginas hijas -->
      <router-view :socket="socket" />
      
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, inject, provide  } from 'vue'
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
  const drawerCompras = ref(false)

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

  const shoppingCart = ref([])
  provide('shoppingCart', shoppingCart)

  function cerrarDrawerSiClicFuera () {
    drawerCompras.value = false
    leftDrawerOpen.value = false
  }

  // Exportar para usar en otros componentes si es necesario
  defineExpose({
    socket,
    socketConnected,
    socketId,
    enviarMensaje
  })
</script>