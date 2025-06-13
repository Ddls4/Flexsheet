<template>
  <q-page class="flex flex-center bg-grey-2">
    
    <div class="row">
      <div class="col-12">   
        <div class="col-12 text-center">
          <q-img src="" class="q-mb-md" style="max-width: 50px; max-height: 50px;" />
          <q-label class="text-h6">Flexsheet</q-label>
        </div>
        
        <q-label class="text-subtitle1">Proyecto DDFJG : descripcion temporal</q-label>

      </div>
      <div class="col-12">
        <!-- menu de botones -->
        <div class="row q-mb-md">
          <q-btn class="q-mr-sm" color="primary" @click="AbrirDialogCreacion"> Crear</q-btn>
          <q-btn         :color="selectionMode ? 'negative' : 'secondary'" 
            @click="toggleSelectionMode">
            {{ selectionMode ? 'Cancelar selección' : 'Seleccionar para eliminar' }}
          </q-btn>
          <q-btn color="negative" @click="showConfirmDialog = true" :disable="!selectionMode || selectedCardIndex === null">
            Eliminar
          </q-btn>
          <q-btn class="q-mr-sm" color="secondary" @click="editarCard" > 
            Editar
          </q-btn>
        </div>

        <!-- Card /tabla -->
        <div class="row q-col-gutter-md"> 
          <div v-for="(card, index) in cards" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="cursor-pointer"  :class="{ 'border-primary': selectedCardIndex === index && selectionMode, 'border': true }"
            @click="cardClicked(index)">
              
              <q-card-section>
                <q-img 
                  v-if="card.imageUrl" 
                  :src="card.imageUrl"
                  style="height: 100px; margin-bottom: 10px;"
                />
                <div class="text-h6">{{ card.title }}</div>
                <div class="text-subtitle2">Creado: {{ card.date }}</div>
              </q-card-section>

            </q-card>
          </div>
        </div>

      </div>
    </div>

    <!-- Diálog para crear nueva Card -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">Crear Nueva Card</h2>
          
          <form @submit.prevent="handleSubmit">
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Título</label>
              <input 
                v-model="newCard.title"
                type="text" 
                class="w-full px-3 py-2 border rounded"
                required
              >
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">URL de la imagen</label>
              <input 
                v-model="newCard.imageUrl"
                type="url" 
                class="w-full px-3 py-2 border rounded"
              >
            </div>
            
            <div class="flex justify-end gap-2">
              <button 
                type="button"
                @click="CerrarDialogCreate"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Crear Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    
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
</template>

<script setup>
 // Sistema para entrar a las tablas
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router'
    import axios from 'axios'

    const router = useRouter()

    const showCreateDialog = ref(false);
    const showConfirmDialog = ref(false);
    const cards = ref([]);
    const newCard = ref({title: '',imageUrl: ''});

    const selectedCardIndex = ref(null);
    const selectionMode = ref(false);

    const fetchUserCards = async () => {
      try {
        const response = await axios.get('http://localhost:80/cards', {
          withCredentials: true
        });
        console.log('Cards:', response.data.cards);

        // Guardar en el estado
        cards.value = response.data.cards.map(card => ({
          id: card.id,
          title: card.title,
          date: card.created_at, // ajustá si se llama distinto
          imageUrl: card.imageUrl
        }));

      } catch (error) {
        console.error('Error al obtener las cards:', error.response?.data || error.message);
      }
    };

    const AbrirDialogCreacion = () => {
      showCreateDialog.value = true;
    };
    const CerrarDialogCreate = () => {
      showCreateDialog.value = false;
      newCard.value = { title: '', imageUrl: '' };
    };
const handleSubmit = async () => {
  try {
    // 1. Preparar los datos de la card
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const cardData = {
      title: newCard.value.title,
      date: formattedDate,
      imageUrl: newCard.value.imageUrl
    };

    // 2. Enviar al backend (usando axios)
    const response = await axios.post('http://localhost:80/cards', cardData, {
      withCredentials: true // Importante para la sesión
    });

    // 3. Si es exitoso, actualizar el frontend
    if (response.data.success) {
      cards.value.push({
        id: response.data.cardId, // ID generado por MySQL
        name: cardData.title,
        date: cardData.date,
        imageUrl: cardData.imageUrl
      });
      
      console.log('Card guardada en BD:', response.data);
      CerrarDialogCreate();
    }
  } catch (error) {
    console.error('Error al guardar la card:', error.response?.data || error.message);
    // Puedes mostrar un mensaje de error al usuario
  }
};

    const toggleSelectionMode = () => {
      selectionMode.value = !selectionMode.value;
      selectedCardIndex.value = null; // limpiar selección cuando cambie el modo
    };

    const cardClicked = (index) => {
      if (selectionMode.value) {
        // modo selección: seleccionar/deseleccionar card
        if (selectedCardIndex.value === index) {
          selectedCardIndex.value = null;
        } else {
          selectedCardIndex.value = index;
        }
      } else {
        // modo normal: redirigir a /tabla pasando la card o su nombre
        const card = cards.value[index];
        router.push({ path: '/tabla', query: { name: card.title } });
      }
    };
    const confirmarEliminar = () => {
      eliminarCard();
      showConfirmDialog.value = false;
    };
    const eliminarCard = () => {
      if (selectedCardIndex.value !== null) {
        cards.value.splice(selectedCardIndex.value, 1);
        selectedCardIndex.value = null; // Limpiar selección luego de eliminar
      }
    };
    
    onMounted(() => {
      fetchUserCards();
    });
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