<template>
 <q-page class="flex bg-blue-grey-10 text-white">
    <!-- Fondo -->
    <q-img
      src="~assets/bg-carwash.jpg"
      class="absolute-top-left"
      style="opacity: 0.05; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
    />
    <!-- Contenedor general -->
    <div class="row fit q-pa-md" style="z-index: 1;">

      <!-- 🔹 Filtros laterales -->
      <div
        class="col-12 col-md-3 col-lg-2 bg-blue-grey-9 q-pa-md q-mb-md"
        style="border-radius: 8px; min-height: 90vh;"
      >
        <div class="text-h6 text-center q-mb-md bg-blue-5 q-pa-sm rounded-borders">
          <q-icon name="filter_alt" size="sm" class="q-mr-sm" /> Filtros
        </div>

        <!-- Fecha y hora en inputs compactos -->
        <div class="q-gutter-sm">
          <q-input
            v-model="filters.dateRange"
            label="Fecha"
            standout="bg-light-blue-5 text-white"
            readonly
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer" @click="showDate = true" />
            </template>
          </q-input>

          <q-input
            v-model="filters.time"
            label="Hora"
            standout="bg-light-blue-5 text-white"
            readonly
            dense
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer" @click="showTime = true" />
            </template>
          </q-input>

          <!-- Dialogs compactos -->
          <q-dialog v-model="showDate">
            <q-card>
              <q-date v-model="filters.dateRange" mask="YYYY-MM-DD" range color="blue-5" />
              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="showTime">
            <q-card>
              <q-time v-model="filters.time" format24h color="blue-5" />
              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!-- Otros filtros -->
          <q-input input-class="text-white" standout="bg-light-blue-5 text-white" dense filled v-model="filters.nombre" label="Buscar Nombre" />
          <q-select use-chips standout="bg-light-blue-5 text-white" dense filled v-model="departamento" :options="Object.keys(ciudadesPorDepartamento)" label="Departamento" />
          <q-select use-chips standout="bg-light-blue-5 text-white" dense filled v-model="ciudad" :options="ciudades" label="Ciudad" />
          <q-select standout="bg-light-blue-5 text-white" dense filled v-model="precio" :options="precios" label="Precio" />
        </div>
      </div>

       <!-- 🔹 Zona de negocios -->
      <div class="col-12 col-md-9 col-lg-10">
        <div class="row q-col-gutter-md ">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="col-6 col-sm-4 col-md-3 col-lg-2 q-mb-md"
          >
            <q-card
              class="cursor-pointer hover-card"
              @click="cardClicked(card)"
            >
              <q-img
                :src="card.imagenURL || 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'"
                ratio="1"
                class="rounded-borders"
              >
                <div class="absolute-bottom text-center text-subtitle2 bg-blue-grey-10 bg-opacity-60">
                  {{ card.Nombre_N }}
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔹 Diálogo de negocio -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 80vw; max-width: 90vw;">
        <q-card-section class="row">

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
                :src="servicio.imagenURL || 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'"
                alt="Imagen del servicio"
                style="width: 80px; height: 80px; object-fit: cover;"
                class="q-mr-md rounded-borders"
              />
              <div>
                <div class="text-subtitle2">{{ servicio.titulo }}</div>
                <div class="text-caption">Precio: ${{ servicio.precio }}</div>
                <div class="text-caption text-grey">{{ servicio.descripcion }}</div>
              </div>
            </div>
          </div>

          <div class="col-6 q-pa-md">
            <h5 class="q-mb-sm">{{ selectedCard?.Nombre_N }}</h5>
            <q-img
              :src="selectedCard?.url_i || 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'"
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
  dateRange: null,
  time: null,
  nombre: "",
})
const showDate = ref(false)
const showTime = ref(false)

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

const precios = ref(['< $1000', '$1000 - $5000', '> $5000'])


// 

const ciudadesPorDepartamento = {
  'Artigas': ['Artigas', 'Bella Unión', 'Tomás Gomensoro'],
  'Canelones': ['Canelones', 'Las Piedras', 'La Paz', 'Santa Lucía'],
  'Cerro Largo': ['Melo', 'Río Branco', 'Fraile Muerto'],
  'Colonia': ['Colonia del Sacramento', 'Carmelo', 'Nueva Helvecia'],
  'Durazno': ['Durazno', 'Sarandí del Yí'],
  'Flores': ['Trinidad'],
  'Florida': ['Florida', 'Sarandí Grande', 'Casupá'],
  'Lavalleja': ['Minas', 'José Pedro Varela'],
  'Maldonado': ['Maldonado', 'Punta del Este', 'San Carlos'],
  'Montevideo': ['Montevideo'],
  'Paysandú': ['Paysandú', 'Guichón', 'Quebracho'],
  'Río Negro': ['Fray Bentos', 'Young'],
  'Rivera': ['Rivera', 'Tranqueras'],
  'Rocha': ['Rocha', 'Chuy', 'La Paloma'],
  'Salto': ['Salto', 'Constitución', 'Belén'],
  'San José': ['San José de Mayo', 'Libertad', 'Ciudad del Plata'],
  'Soriano': ['Mercedes', 'Dolores'],
  'Tacuarembó': ['Tacuarembó', 'Paso de los Toros'],
  'Treinta y Tres': ['Treinta y Tres', 'Vergara']
}; 

const ciudades = computed(() => {
  return departamento.value ? ciudadesPorDepartamento[departamento.value] : [];
});


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




<style scoped>
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

</style>