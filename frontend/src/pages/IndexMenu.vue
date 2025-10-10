<template>
  <q-page class=" flex  " >
    <!--  -->
    <div class="row q-pa-md bg-blue-grey-10 text-white fit ">
      <!-- Filtros -->
      <div class="col-3 col-md-3 col-lg-3 col-xl-2 col-12 bg-blue-grey-9 q-mb-md q-order-1 q-order-sm-0">
          <div class="row items-center q-gutter-sm q-mb-md full-width bg-blue-5" style=" padding: 10px; border-radius: 5px; min-height: 60px; ">
            <label>Filtro</label>
          </div>
          <div class="q-pa-md q-gutter-md">
            <!-- Fecha -->
            <q-date
              v-model="filters.dateRange"
              mask="YYYY-MM-DD"
              color="blue-5"
              dark
              range
              class="q-mb-md"
            />

            <!-- Hora -->
            <q-time
              v-model="filters.time"
              format24h
              color="blue-5"
              dark
              class="q-mb-md"
            />

            <!-- Mostrar fecha seleccionada -->
            <div class="q-mb-lg text-subtitle2">{{ displayText }}</div>
          </div>

          <q-input standout="bg-light-blue-5 text-white" filled v-model="filters.nombre" label="Buscar Nombre" class="q-mb-md" />
          <q-select standout="bg-light-blue-5 text-white" filled v-model="departamento" :options="departamentos" label="Departamento" class="q-mb-md"/>
          <q-select standout="bg-light-blue-5 text-white" filled v-model="ciudad" :options="ciudades" label="Ciudad" class="q-mb-md"/>
          <q-select standout="bg-light-blue-5 text-white" filled v-model="precio" :options="precios" label="Precio" class="q-mb-md" />

      </div>

      <!-- Cargar Negocios -->
      <div class="col-9 bg-blue-grey-8 " >
        <div class="row q-col-gutter-md" style="margin: 5px;"> 
          <div v-for="(card, index) in cards" :key="index" class="col-6 col-sm-4 col-md-3 col-lg-2">
            <q-card style="max-width: 200px;" class="cursor-pointer"
            @click="cardClicked(card)">
              
              <q-card-section style="padding: 0;">
                <q-img 
                  v-if="card.imagenURL ||  'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'  " 
                  :src="card.imagenURL ||  'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg' "
                  style=" max-width: 200px; max-height: 200px; width: 100%; height: 100%; object-fit: cover; padding: 0;"
                >
                <div class="absolute-bottom text-subtitle2 text-center">{{ card.Nombre_N}}</div>
                
                </q-img>
              </q-card-section>

            </q-card>
          </div>
        </div>
      </div>

    </div>

<q-dialog v-model="showDialog" persistent>
  <q-card style="min-width: 80vw; max-width: 90vw;">
    <q-card-section class="row">

      <!-- Lado izquierdo: Servicios con checkboxes -->
      <div class="col-6 q-pa-md" style="border-right: 1px solid #ccc;">
        <div
          v-for="(servicio, index) in selectedCard?.servicios || []"
          :key="index"
          class="q-mb-md row items-center"
        >
          <q-checkbox
            :model-value="isInCart(servicio)"
            @update:model-value="val => toggleProductSelection(servicio, val)"
            class="q-mr-sm"
          />
          <q-img
            :src="servicio.imagenURL || 'https://via.placeholder.com/80'"
            alt="Imagen del servicio"
            style="width: 80px; height: 80px; object-fit: cover;"
            class="q-mr-md"
          />
          <div>
            <div class="text-subtitle2">{{ servicio.titulo }}</div>
            <div class="text-caption">Precio: ${{ servicio.precio }}</div>
            <div class="text-caption text-grey">{{ servicio.descripcion }}</div>
          </div>
        </div>
      </div>

      <!-- Lado derecho: Información del negocio -->
      <div class="col-6 q-pa-md">
        <h5 class="q-mb-sm">{{ selectedCard?.Nombre_N }}</h5>
        <q-img
          :src="selectedCard?.url_i || 'https://via.placeholder.com/300x200'"
          alt="Imagen del negocio"
          style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
          class="q-mb-md"
        />
        <p class="q-mb-none"><b>Departamento:</b> {{ selectedCard?.Departamento }}</p>
        <p><b>Ciudad:</b> {{ selectedCard?.Ciudad }}</p>
      </div>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

  </q-page>

</template>


<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { io } from 'socket.io-client'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const socket = io(`http://${import.meta.env.VITE_P_IP}:80`) // Cambiar según tu backend

// === Carrito compartido ===
const shoppingCart = inject('shoppingCart')
if (!shoppingCart) throw new Error('❌ No se encontró el carrito (shoppingCart)')

// === Estados ===
const cards = ref([])                // Negocios disponibles
const selectedCard = ref(null)       // Card seleccionada
const showDialog = ref(false)        // Control q-dialog

// === Filtros ===
const filters = ref({
  dateRange: { from: '', to: '' },
  time: '',
  nombre: '',
  departamento: '',
  ciudad: '',
  precio: ''
})

const displayText = computed(() => {
  const { from, to } = filters.value.dateRange
  const time = filters.value.time
  if (from && to && time) return `Desde ${from} hasta ${to} a las ${time}`
  if (from && to) return `Desde ${from} hasta ${to} (sin hora)`
  if (from) return `Fecha seleccionada: ${from}`
  if (time) return `Hora seleccionada: ${time}`
  return 'Ninguna fecha u hora seleccionada'
})

// Opciones para selects
const departamento = ref(null)
const ciudad = ref(null)
const precio = ref(null)
const departamentos = ref(['Montevideo', 'Canelones', 'Maldonado'])
const ciudades = ref(['Ciudad Vieja', 'Pando', 'Punta del Este'])
const precios = ref(['< $1000', '$1000 - $5000', '> $5000'])

// === Funciones ===

// Cargar todos los negocios

const cargarNegocios = () => {
  socket.emit("listar_negocios", null, (data) => {
    if (data.negocios) {
      cards.value = data.negocios
      console.log("Negocios cargados:", data.negocios)
    }else $q.notify({ type: "negative", message: data.error || "Error al obtener negocios" })
  })
}


// Manejar click en un negocio
const cardClicked = (card) => {
  selectedCard.value = card
  showDialog.value = true
}

// Verificar si un producto ya está en el carrito
const isInCart = (product) =>
  shoppingCart.value.some((p) => p.titulo === product.titulo)

// Agregar o quitar del carrito
const toggleProductSelection = (product, selected) => {
  if (selected) {
    if (!isInCart(product)) shoppingCart.value.push(product)
  } else {
    const i = shoppingCart.value.findIndex((p) => p.titulo === product.titulo)
    if (i !== -1) shoppingCart.value.splice(i, 1)
  }
}

// === Lifecycle ===
onMounted(() => {
  cargarNegocios()
})
</script>



<style>
.border {
  border: 2px solid transparent;
  border-radius: 4px;
}

.border-primary {
  border-color: #027be3; /* color azul de Quasar */
}
</style>
