<template>
  <q-page class=" flex   bg-grey-2" >
    <div class="column q-pa-md" style="width: 100%; height: 100vh; background-color: rgb(33, 37, 41); ">

      <div class="col-6">
        <div class="text-center q-mb-md" style="color: white;">
          <div style="padding: 10vh;">
              <q-label class="text-h2">Flexsheet</q-label>
          </div>
          <div>   
              <q-label class="text-subtitle1 text-center">Silplificamos tu gestion de datos. Deve registrarse para usar la funcion crear</q-label>
          </div>
        </div>
      </div>

      <div class="col-6" >
        <!-- menu de botones -->
        <div class="row q-mb-md">
          <q-btn class="q-mr-sm" color="primary" @click="showCreateDialog = true;"> Crear</q-btn>

          <q-btn         :color="selectionMode ? 'negative' : 'secondary'" @click="toggleSelectionMode">
            {{ selectionMode ? 'Cancelar selección' : 'Seleccionar para eliminar' }}
          </q-btn>

          <q-btn color="negative" @click="showConfirmDialog = true" :disable="!selectionMode || selectedCardIndex === null">Eliminar</q-btn>
          <q-btn class="q-mr-sm" color="secondary" @click="editarCard" > Editar </q-btn>

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
    <q-dialog v-model="showCreateDialog" persistent> <!-- v-model="showCreateDialog" -->

      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Crear Nueva Card</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newCard.title" type="text"  placeholder="nombre" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newCard.imageUrl" type="url" placeholder="URL" autofocus @keyup.enter="showCreateDialog = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" type="submit" @click="handleSubmit" v-close-popup />
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
        const response = await axios.get('http://192.168.1.10:80/cards', {
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
      const response = await axios.post('http://192.168.1.10:80/cards', cardData, {
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