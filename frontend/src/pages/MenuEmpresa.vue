<template>
  <q-page class=" flex  " >
    <!--  -->
    <div class="row q-pa-md bg-blue-grey-10 text-white  " style="width: 100%; height: 100dvh; ">
        <div class="col-2 bg-blue-grey-9 full-height">
            <div class="row items-center q-gutter-sm q-mb-md full-width bg-blue-grey-5" style=" padding: 10px; border-radius: 5px; min-height: 60px; ">
                <label> Menu de opciones</label>
            </div>
            <div class="row items-center q-gutter-sm q-mb-md full-width " style="background-color: #455a63; padding: 10px; border-radius: 5px; height: 500px; ">
              <q-btn color="primary" 
              class="text-white" 
              @click="showCreateDialog = true"
              icon="add">
                  Crear
              </q-btn>
              <q-btn
                  :color="selectionMode ? 'negative' : 'secondary'"
                  class="text-white"
                  @click="toggleSelectionMode"
                  icon="select_all"
              >
                  {{ selectionMode ? 'Cancelar selección' : 'Seleccionar' }}
              </q-btn>
              <q-btn
                  color="negative"
                  class="text-white"
                  @click="showConfirmDialog = true"
                  :disable="!selectionMode || selectedCardIndex === null"
                  icon="remove"
              >
                  Eliminar
              </q-btn>
              <q-btn
                  color="secondary"
                  class="text-white"
                  @click="editarCard"
                  disable
                  icon="edit"
              >
                  Editar
              </q-btn>
            
            </div>

        </div>
      <div class="col-9" style="background-color: #455a64;" >

        <!-- Card /tabla -->
        <div class="row q-col-gutter-md" style="margin: 5px;"> 
          
          <div class="q-mt-lg">
              <div v-for="(item, index) in productos" :key="index" class="row q-mb-md">
                <div class="col-6">
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle1">{{ item.nombre }}</div>
                        <q-img :src="item.imagen" :alt="item.nombre" class="q-my-sm" style="max-height: 150px;" />
                        <div class="text-h6 text-primary">${{ item.precio }}</div>
                      </q-card-section>
                    </q-card>
                </div>
                <div class="col-6">
                    <q-card>
                      <q-card-section>
                        <div class="text-subtitle2">{{ item.titulo }}</div>
                        <div>{{ item.descripcion }}</div>
                      </q-card-section>
                    </q-card>
                </div>
              </div>
          </div>

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

    <q-dialog v-model="showCreateDialog" persistent> 
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6"> Agregar Producto </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="form.nombre"     placeholder="Nombre" />
          <q-input dense v-model="form.imagen"  placeholder="URL_Img" autofocus @keyup.enter="showCreateDialog = false" />
          <q-input dense v-model="form.descripcion"  placeholder="Descripcion" />
          <q-input dense v-model="form.precio"  placeholder="Precio" />
          <q-input dense v-model="form.titulo"  placeholder="Titulo" />
        </q-card-section>


        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" icon-right="cancel" v-close-popup />
          <q-btn flat label="Agregar" icon-right="add" type="submit" @click="agregarProducto" v-close-popup />
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

  </q-page>

  <!-- Drawer de Servicios -->
  <q-drawer
    v-model="showDrawer"
    side="right"
    bordered
    width="400px"
    behavior="mobile"
    overlay
  >
    <q-toolbar>
      <q-toolbar-title>Servicios de {{ negocioSeleccionado?.title }}</q-toolbar-title>
      <q-btn flat icon="close" @click="showDrawer = false" />
    </q-toolbar>

    <q-card-section>
      <div v-for="(servicio, i) in servicios" :key="i" class="q-mb-sm">
        <q-card>
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


  </q-drawer>

</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import { io } from "socket.io-client";

  const router = useRouter()
  const showCreateDialog = ref(false);
  const showConfirmDialog = ref(false);
  const cards = ref([]);
  const newCard = ref({title: '',imagenURL: ''});
  const selectedCardIndex = ref(null);
  const selectionMode = ref(false);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const socket = io(`http://${import.meta.env.VITE_P_IP}:80`, {
    auth: {
      userId: storedUser.id
    },
    withCredentials: true,
    autoConnect: false
  });

  const showDrawer = ref(false)
  const negocioSeleccionado = ref(null)
  const servicios = ref([])

  const fetchUserCards = async () => {
    // Usar Promise para manejar la respuesta
    new Promise((resolve, reject) => {
      socket.emit("solicitar_cards", (response) => {
        if (response.error) {
          console.error("Error:", response.error);
          if (response.error === "No autorizado") {
            localStorage.removeItem('user');
            router.push('/login');
          }
          reject(response.error);
        } else {
          cards.value = response.cards.map(card => ({
            id: card.id,
            title: card.title,
            imagenURL: card.imagenURL || 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg'
          }));
          resolve(response.cards);
        }
      });
    }).catch(error => {
      console.error("Error al obtener cards:", error);
    });
  };
  function agregarProducto() {
    if (!form.value.nombre || !form.value.imagen || !form.value.precio) {
      alert('Completa los campos obligatorios');
      return;
    }

    productos.value.push({ ...form.value });
    // Reset form
    form.value = {
      nombre: '',
      titulo: '',
      imagen: '',
      precio: '',
      descripcion: ''
    };
    dialog.value = false;
  }
  const toggleSelectionMode = () => {
      selectionMode.value = !selectionMode.value;
      selectedCardIndex.value = null; // limpiar selección cuando cambie el modo
  };
  const confirmarEliminar = () => {
      eliminarNegocioSeleccionado();
      showConfirmDialog.value = false;
  };
  const eliminarNegocioSeleccionado = () => {
    if (selectedCardIndex.value === null) return alert("Selecciona un negocio primero");

    const negocio = cards.value[selectedCardIndex.value];

    if (!confirm(`¿Seguro que quieres eliminar el negocio "${negocio.Nombre_N}"?`)) return;

    socket.emit("eliminar_negocio", { negocioId: negocio.id }, (res) => {
      if (res.success) {
        cards.value.splice(selectedCardIndex.value, 1);
        selectedCardIndex.value = null;
        alert("Negocio eliminado con éxito");
      } else {
        alert(res.message || "Error al eliminar negocio");
      }
    });
  };
      
  onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      socket.connect();
      fetchUserCards();
    } else {
      router.push('/login');
    }
  });

  const cardClicked = (index) => {
    // Si está en modo selección, no abrir el drawer
    if (selectionMode.value) {
      // Alternar selección (por si querés poder seleccionar varias o una sola)
      selectedCardIndex.value = selectedCardIndex.value === index ? null : index
      return // detener la ejecución aquí
    }
    const card = cards.value[index]
    negocioSeleccionado.value = card
    showDrawer.value = true

    // Aquí podrías hacer un emit al backend para obtener los servicios del negocio
    socket.emit("obtener_servicios", { negocioId: card.id }, (response) => {
      if (response.success) {
        servicios.value = response.servicios
      } else {
        console.error(response.message)
      }
    })
  }

  // Agregar Servicio 
  const showServicioDialog = ref(false)
  const modoEdicion = ref(false)
  const formServicio = ref({
    titulo: '',
    descripcion: '',
    precio: '',
    imagenURL: ''
  })
  let servicioEditIndex = null

  const abrirFormularioAgregarServicio = () => {
    modoEdicion.value = false
    formServicio.value = {
      titulo: '',
      descripcion: '',
      precio: '',
      imagenURL: ''
    }
    showServicioDialog.value = true
  }

  const editarServicio = (index) => {
    modoEdicion.value = true
    servicioEditIndex = index
    formServicio.value = { ...servicios.value[index] }
    showServicioDialog.value = true
  }

  const guardarServicio = () => {
    if (!formServicio.value.titulo || !formServicio.value.precio) {
      alert('Título y precio son obligatorios')
      return
    }

    if (modoEdicion.value) {
      // Actualizar servicio existente
      servicios.value[servicioEditIndex] = { ...formServicio.value }

      socket.emit('editar_servicio', {
        negocioId: negocioSeleccionado.value.id,
        servicio: servicios.value[servicioEditIndex]
      }, (res) => {
        if (!res.success) {
          alert('Error al actualizar el servicio')
        }
      })

    } else {
      // Agregar nuevo servicio
      const nuevoServicio = { ...formServicio.value }

      socket.emit('agregar_servicio', {
        negocioId: negocioSeleccionado.value.id,
        servicio: nuevoServicio
      }, (res) => {
        if (res.success) {
          servicios.value.push(nuevoServicio)
        } else {
          alert('Error al agregar servicio')
        }
      })
    }

    showServicioDialog.value = false
  }

  const eliminarServicio = (servicioId) => {
  if (!confirm("¿Seguro que querés eliminar este servicio?")) return;

  socket.emit("eliminar_servicio",{
      negocioId: negocioSeleccionado.value.id,
      servicioId: servicioId,
    },
    (res) => {
      if (res.success) {
        servicios.value = res.servicios; // actualizar la lista local
        alert("Servicio eliminado con éxito");
      } else {
        alert(res.message || "Error al eliminar servicio");
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
</style>