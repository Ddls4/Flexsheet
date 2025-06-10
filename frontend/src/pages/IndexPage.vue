<template>
  <q-page class="flex flex-center bg-grey-2">
    
    <div class="row">
      <div class="col-12">   
        <div class="col-12 text-center">
          <q-img src="" class="q-mb-md" style="max-width: 50px; max-height: 50px;" />
          <q-label class="text-h6">Flexsheet</q-label>
        </div>
        
        <q-label class="text-subtitle1">Proyecto DDFJG : Nose finge que esto es una descripcion</q-label>

      </div>
      <div class="col-12">
        <!-- Crear un menu para crear card -->
        <div class="row q-mb-md">
          <q-btn class="q-mr-sm" color="primary" @click="openCreateDialog"> Crear</q-btn>
          <q-btn class="q-mr-sm" color="negative" @click="" > Eliminar</q-btn>
        </div>


        <div class="row q-col-gutter-md"> 
          <div v-for="(card, index) in cards" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="cursor-pointer" @click="openTabla(card.name)">
              <!-- Mostrar imagen si existe imageUrl -->

              <q-card-section>
                  <q-img 
                  v-if="card.imageUrl" 
                  :src="card.imageUrl"
                  style="height: 100px; margin-bottom: 10px;"
                />
                <div class="text-h6">{{ card.name }}</div>
                <div class="text-subtitle2">Creado: {{ card.date }}</div>
              </q-card-section>

            </q-card>
          </div>
        </div>

      </div>
    </div>

    <!-- Diálogo para crear nueva Card -->
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
                @click="closeCreateDialog"
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




  </q-page>
</template>

<script setup>
 // Sistema para entrar a las tablas
    import { ref } from 'vue'
    const showCreateDialog = ref(false);
    const cards = ref([
    ]);
    const newCard = ref({
      title: '',
      imageUrl: ''
    });

    const openCreateDialog = () => {
      showCreateDialog.value = true;
    };
    const closeCreateDialog = () => {
      showCreateDialog.value = false;
      newCard.value = { title: '', imageUrl: '' };
      
    };
    const handleSubmit = () => {
      // Crear la nueva card con la estructura correcta
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      cards.value.push({
        name: newCard.value.title,
        date: formattedDate,
        imageUrl: newCard.value.imageUrl
      });
      
      console.log('Nueva card creada:', newCard.value);
      closeCreateDialog();
    };


</script>
