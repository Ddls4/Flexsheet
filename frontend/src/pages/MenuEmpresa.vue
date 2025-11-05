<template>
  <q-page class=" flex bg-blue-grey-10 text-white " >
    <!-- Imagen de fondo -->
    <q-img
      src="~assets/bg-carwash.jpg"
      class="absolute-top-left"
      style="opacity: 0.05; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
    />
    <!-- Contenedor general -->
    <div class="row fit q-pa-md" style="z-index: 1;">
      <!-- Botones laterales -->
      <div
        class="col-12 col-md-3 col-lg-2 bg-blue-grey-9 q-pa-md q-mb-md menu-lateral"
        style="border-radius: 8px;"
      >
        <!-- Texto menu -->
        <div class="text-h6 text-center q-mb-md bg-blue-5 q-pa-sm rounded-borders">
          <q-icon name="filter_alt" size="sm" class="q-mr-sm" /> Menu de opciones
        </div>
        <!-- Botones -->
        <div class="q-gutter-md"
      style="display: flex; flex-direction: column; align-items: center; padding-top: 15px; max-width: 500px; margin: 0 auto;">
            <q-btn
              color="primary"
              class="text-white"
              @click="showCreateDialog = true"
              icon="add"
              style="width: 100%; min-height: 42px;"
              rounded
              unelevated
            >
              Crear
            </q-btn>

            <q-btn
              :color="selectionMode ? 'negative' : 'secondary'"
              class="text-white"
              @click="toggleSelectionMode"
              icon="select_all"
              style="width: 100%; min-height: 42px;"
              rounded
              unelevated
            >
              {{ selectionMode ? 'Cancelar selección' : 'Seleccionar' }}
            </q-btn>

            <q-btn
              color="negative"
              class="text-white"
              @click="showConfirmDialog = true"
              :disable="!selectionMode || selectedCardIndex === null"
              icon="remove"
              style="width: 100%; min-height: 42px;"
              rounded
              unelevated
            >
              Eliminar
            </q-btn>

            <q-btn
              color="secondary"
              class="text-white"
              @click="abrirDialogoEdicion(cards[selectedCardIndex])"
              icon="edit"
              style="width: 100%; min-height: 42px;"
              rounded
              unelevated
            >
              Editar
            </q-btn>
        </div>

      </div>
      <!-- Zona de negocios -->
      <div class="col-12 col-md-9 col-lg-10">
        <!-- Card /tabla -->
        <div class="row q-col-gutter-md" style="margin: 5px;"> 
          <div v-for="(card, index) in cards" :key="index" class="col-6 col-sm-3 col-md-2 col-lg-1">
            <q-card style="max-width: 200px;" class="cursor-pointer"  :class="{ 'border-primary': selectedCardIndex === index && selectionMode, 'border': true  }"
            @click="cardClicked(index)">
              
              <q-card-section style="padding: 0;">
                <q-img 
                  v-if="card.imagenURL ||  'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'  " 
                  :src="card.imagenURL ||  'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg' "
                  style=" max-width: 200px; max-height: 200px; width: 100%; height: 100%; object-fit: cover; padding: 0;"
                >
                <div class="absolute-bottom text-subtitle2 text-center">{{ card.title }}</div>
                
                </q-img>
              </q-card-section>

            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Cracion Negocio -->
    <q-dialog v-model="showCreateDialog" persistent> 
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6"> Crear Negocio </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="form.Nombre_N"     placeholder="Nombre" />
          <q-input dense v-model="form.url_i"  placeholder="URL_Img" autofocus @keyup.enter="showCreateDialog = false" />
          <q-select
            dense
            v-model="form.departamento"
            :options="departamentos"
            label="Departamento"
            emit-value
            map-options
            @update:model-value="form.ciudad = ''"
          />

          <q-select
            dense
            v-model="form.ciudad"
            :options="form.departamento ? ciudadesPorDepartamento[form.departamento] : []"
            label="Ciudad"
            :disable="!form.departamento"
          />
        </q-card-section>


        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" icon-right="cancel" v-close-popup />
          <q-btn flat label="Agregar" icon-right="add" type="submit" @click="crear_negocio"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Dialog Confirmación Eliminar -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card style="min-width: 300px;">
        <q-card-section class="text-h6">
          ¿Estás seguro que deseas eliminar esta card?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="confirmarEliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Dialog Editar Negocio -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Negocio</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="editForm.Nombre_N" placeholder="Nombre del Negocio" />
          <q-input dense v-model="editForm.url_i" placeholder="URL Imagen" />
          <q-select
            dense
            v-model="editForm.departamento"
            :options="departamentos"
            label="Departamento"
            emit-value
            map-options
            @update:model-value="editForm.ciudad = ''"
          />

          <q-select
            dense
            v-model="editForm.ciudad"
            :options="editForm.departamento ? ciudadesPorDepartamento[editForm.departamento] : []"
            label="Ciudad"
            :disable="!editForm.departamento"
          />
          <div class="q-mt-sm">
            <q-checkbox 
              v-model="editForm.publico" 
              label="Visible al público"
              color="green"
            />
          </div>
        </q-card-section>


        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" icon-right="cancel" v-close-popup />
          <q-btn flat label="Guardar" icon-right="save" color="primary" @click="editar_negocio" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Drawer de Servicios -->
    <q-dialog v-model="showDrawer" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-blue-grey-10 text-white" style="min-width: 400px; max-width: 90vw; max-height: 90vh;">
        <q-toolbar>
          <q-toolbar-title>
            Servicios de {{ negocioSeleccionado?.title }}
          </q-toolbar-title>
          <q-btn flat dense icon="close" @click="showDrawer = false" />
        </q-toolbar>
        <div class="q-pa-md q-mb-sm flex items-center justify-between">
          <div class="text-subtitle2">Visibilidad del negocio</div>
          <q-toggle
            v-model="negocioSeleccionado.publico"
            color="green"
            checked-icon="visibility"
            unchecked-icon="visibility_off"
            @update:model-value="(val) => actualizarEstadoPublico(negocioSeleccionado, val)"
          />
        </div>
        <q-separator dark />

        <q-card-section style="overflow-y: auto; max-height: 60vh;">
          <div v-for="(servicio, i) in servicios" :key="i" class="q-mb-sm ">
            <q-card flat bordered class="bg-blue-grey-9">
              <q-card-section>
                <div class="text-subtitle2">{{ servicio.titulo }}</div>
                <div>{{ servicio.descripcion }}</div>
                <div class="text-bold">${{ servicio.precio }}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn color="primary" icon="edit" flat @click="editarServicio(i)" />
                <q-btn color="negative" icon="delete" flat @click="eliminarServicio(servicio._id)" />
              </q-card-actions>
            </q-card>
          </div>

          <q-btn color="positive" label="Agregar Servicio" icon="add" @click="abrirFormularioAgregarServicio" />
        </q-card-section>
        
        <!-- Dialogo para editar/agregar servicio -->
        <q-dialog v-model="showServicioDialog" persistent>
          <q-card style="min-width: 400px;">
            <q-card-section>
              <div class="text-h6">{{ modoEdicion ? 'Editar Servicio' : 'Agregar Servicio' }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="formServicio.titulo" label="Título" dense autofocus />
              <q-input v-model="formServicio.descripcion" label="Descripción" dense />
              <q-input v-model="formServicio.precio" label="Precio" type="number" dense />
              <q-input v-model="formServicio.imagenURL" label="URL de Imagen" dense />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn flat :label="modoEdicion ? 'Guardar' : 'Agregar'" color="positive" @click="guardarServicio" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router'

// === Usar socket inyectado en lugar de crear uno nuevo ===
const socket = inject('socket')
const socketConnected = inject('socketConnected')

const router = useRouter()
const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
const userId = storedUser.id || '';

// Variables Negocios
const showCreateDialog = ref(false);
const showConfirmDialog = ref(false);
const showEditDialog = ref(false)
const form = ref({
  Nombre_N: '',
  url_i: '',
  departamento: '',
  ciudad: '',
  usuario: userId,
})
const editForm = ref({
  negocioId: '',
  Nombre_N: '',
  url_i: '',
  departamento: '',
  ciudad: '',
  publico: false
});
const cards = ref([]);
const selectedCardIndex = ref(null);
const selectionMode = ref(false);
const showDrawer = ref(false)
const negocioSeleccionado = ref(null)
const servicios = ref([])
const mensaje = ref('')

// Variables Servicios
const showServicioDialog = ref(false)
const modoEdicion = ref(false)
const formServicio = ref({
  titulo: '',
  descripcion: '',
  precio: '',
  imagenURL: ''
})
let servicioEditIndex = null

const ciudadesPorDepartamento = {
  'Artigas': ['Artigas', 'Bella Unión', 'Tomás Gomensoro'],
  'Canelones': ['Canelones', 'Las Piedras', 'La Paz', 'Santa Lucía'],
  'Cerro Largo': ['Melo', 'Río Branco', 'Fraile Muerto'],
  'Colonia': ['Colonia del Sacramento', 'Carmelo', 'Juan Lacaze'],
  'Durazno': ['Durazno', 'Sarandí del Yí'],
  'Flores': ['Trinidad'],
  'Florida': ['Florida', 'Sarandí Grande'],
  'Lavalleja': ['Minas', 'José Pedro Varela'],
  'Maldonado': ['Maldonado', 'Punta del Este', 'San Carlos'],
  'Montevideo': ['Montevideo'],
  'Paysandú': ['Paysandú', 'Guichón'],
  'Río Negro': ['Fray Bentos', 'Young'],
  'Rivera': ['Rivera', 'Tranqueras'],
  'Rocha': ['Rocha', 'Castillos', 'Chuy'],
  'Salto': ['Salto', 'San Antonio'],
  'San José': ['San José de Mayo', 'Libertad'],
  'Soriano': ['Mercedes', 'Dolores'],
  'Tacuarembó': ['Tacuarembó', 'Paso de los Toros'],
  'Treinta y Tres': ['Treinta y Tres', 'Vergara']
};
const departamentos = Object.keys(ciudadesPorDepartamento);
// -- Funciones Negocios --

// Verificar conexión antes de cualquier operación
const verificarConexion = () => {
  if (!socket?.value || !socketConnected?.value) {
    mensaje.value = "Error: No hay conexión con el servidor";
    return false;
  }
  return true;
}

// Carga los Negocio para verlos  
const fetchUserCards = async () => {
  if (!verificarConexion()) return;

  socket.value.emit("solicitar_cards", (response) => {
    if (response.error) {
      console.error("Error:", response.error);
      if (response.error === "No autorizado") {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
    } else {
      cards.value = response.cards.map(card => ({
        id: card._id || card.id,
        title: card.Nombre_N || card.title,
        imagenURL: card.imagenURL || 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg',
        departamento: card.Departamento,
        ciudad: card.Ciudad,
        servicios: card.servicios || [],
        publico: card.publico || false
      }));
    }
  });
};

// Agregamos un Negocio
function crear_negocio() {
  if (!verificarConexion()) return;
  
  if (!form.value.Nombre_N || !form.value.departamento || !form.value.ciudad) {
    alert('Completa los campos obligatorios');
    return;
  }

  socket.value.emit('crear_negocio', form.value, (response) => {
    if (response.success) {
      mensaje.value = 'Negocio registrado con éxito'
      showCreateDialog.value = false;
      fetchUserCards(); // Recargar la lista
    } else {
      mensaje.value = response.message || 'Error al registrar Empresa'
    }
  });
}

// Editar
function abrirDialogoEdicion(negocio) {
  if (!negocio) {
    alert("Selecciona un negocio primero");
    return;
  }
  
  const negocioId = negocio.id || negocio._id;
  editForm.value = {
    negocioId,
    Nombre_N: negocio.title || negocio.Nombre_N,
    url_i: negocio.imagenURL || negocio.url_i,
    departamento: negocio.departamento || '',
    ciudad: negocio.ciudad || '',
    publico: negocio.publico || false
  };
  showEditDialog.value = true;
}

// Editar - Guardar cambios
function editar_negocio() {
  if (!verificarConexion()) return;
  
  if (!editForm.value.negocioId) {
    alert("Falta el ID del negocio");
    return;
  }

  socket.value.emit("editar_negocio", editForm.value, (response) => {
    if (response.success) {
      mensaje.value = "✅ Negocio actualizado correctamente";
      showEditDialog.value = false;
      fetchUserCards(); // Recargar la lista
    } else {
      mensaje.value = response.message || "❌ Error al actualizar el negocio";
    }
  });
}

// Modo Selecionar 
const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value;
  selectedCardIndex.value = null;
};

// Confirmar Eliminar
const confirmarEliminar = () => {
  eliminarNegocioSeleccionado();
  showConfirmDialog.value = false;
};

// Eliminar el Negocio Selecionado
const eliminarNegocioSeleccionado = () => {
  if (!verificarConexion()) return;
  
  if (selectedCardIndex.value === null) {
    alert("Selecciona un negocio primero");
    return;
  }

  const negocio = cards.value[selectedCardIndex.value];
  if (!confirm(`¿Seguro que quieres eliminar el negocio "${negocio.title}"?`)) return;

  socket.value.emit("eliminar_negocio", { negocioId: negocio.id }, (res) => {
    if (res.success) {
      cards.value.splice(selectedCardIndex.value, 1);
      selectedCardIndex.value = null;
      alert("Negocio eliminado con éxito");
    } else {
      alert(res.message || "Error al eliminar negocio");
    }
  });
}; 

// Negocio Clickeado
const cardClicked = (index) => {
  if (selectionMode.value) {
    selectedCardIndex.value = selectedCardIndex.value === index ? null : index;
    return;
  }
  
  const card = cards.value[index];
  negocioSeleccionado.value = card;
  showDrawer.value = true;

  if (!verificarConexion()) return;

  socket.value.emit("obtener_servicios", { negocioId: card.id }, (response) => {
    if (response.success) {
      servicios.value = response.servicios;
    } else {
      console.error(response.message);
    }
  });
}

// onMounted
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    router.push('/login');
    return;
  }

  // Esperar a que el socket se conecte si es necesario
  if (socketConnected?.value) {
    fetchUserCards();
  } else {
    console.log('⏳ Esperando conexión del socket...');
    // Podrías agregar un watcher aquí si es necesario
  }
});

// -- Funciones Servicios --

// Abrir el dialog de agregar servicio 
const abrirFormularioAgregarServicio = () => {
  if (!verificarConexion()) return;
  
  modoEdicion.value = false;
  formServicio.value = {
    titulo: '',
    descripcion: '',
    precio: '',
    imagenURL: ''
  };
  showServicioDialog.value = true;
}

// Edita los Servicios
const editarServicio = (index) => {
  if (!verificarConexion()) return;
  
  modoEdicion.value = true;
  servicioEditIndex = index;
  formServicio.value = { ...servicios.value[index] };
  showServicioDialog.value = true;
}

// Guarda los cambios Cuando Creas o Editas
const guardarServicio = () => {
  if (!verificarConexion()) return;
  
  if (!formServicio.value.titulo || !formServicio.value.precio) {
    alert('Título y precio son obligatorios');
    return;
  }

  if (modoEdicion.value) {
    // Actualizar servicio existente
    socket.value.emit('editar_servicio', {
      negocioId: negocioSeleccionado.value.id,
      servicio: {
        ...formServicio.value,
        _id: servicios.value[servicioEditIndex]._id
      }
    }, (res) => {
      if (res.success) {
        servicios.value[servicioEditIndex] = { ...formServicio.value };
        showServicioDialog.value = false;
      } else {
        alert(res.message || 'Error al actualizar el servicio');
      }
    });
  } else {
    // Agregar nuevo servicio
    socket.value.emit('agregar_servicio', {
      negocioId: negocioSeleccionado.value.id,
      servicio: formServicio.value
    }, (res) => {
      if (res.success) {
        servicios.value.push({ ...formServicio.value });
        showServicioDialog.value = false;
      } else {
        alert(res.message || 'Error al agregar servicio');
      }
    });
  }
}

// Elimina el Servicio
const eliminarServicio = (servicioId) => {
  if (!verificarConexion()) return;
  
  if (!confirm("¿Seguro que querés eliminar este servicio?")) return;

  socket.value.emit("eliminar_servicio", {
    negocioId: negocioSeleccionado.value.id,
    servicioId: servicioId,
  }, (res) => {
    if (res.success) {
      servicios.value = res.servicios;
      alert("Servicio eliminado con éxito");
    } else {
      alert(res.message || "Error al eliminar servicio");
    }
  });
};
const actualizarEstadoPublico = (negocio, nuevoEstado) => {
  if (!verificarConexion()) return;

  socket.value.emit(
    "actualizar_estado_publico",
    { negocioId: negocio.id, publico: nuevoEstado },
    (res) => {
      if (res.success) {
        console.log(`✅ Negocio "${negocio.title}" actualizado a ${nuevoEstado ? "público" : "privado"}`);
      } else {
        alert(res.message || "Error al actualizar estado de visibilidad");
      }
    }
  );
};
</script>

<style>
.border {
  border: 2px solid transparent;
  border-radius: 4px;
}

.border-primary {
  border-color: #027be3; /* color azul de Quasar */
}
.menu-lateral {
  min-height: 90vh;
  border-radius: 8px;
}

@media (max-width: 1025px) {
  .menu-lateral {
    min-height: 40vh; /* reduce altura a 40% en pantallas chicas */
  }
}
</style>