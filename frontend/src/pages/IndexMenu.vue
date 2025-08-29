<template>
  <q-page class=" flex  " >
    <!--  -->
    <div class="row q-pa-md bg-blue-grey-10 text-white " style="width: 100%; height: 100dvh; ">
        <div class="col-3 bg-blue-grey-9">
            <div class="row items-center q-gutter-sm q-mb-md full-width" style="background-color: red; padding: 10px; border-radius: 5px; min-height: 60px; ">
                <label>filtro</label>
            </div>
        </div>
      <div class="col-9" style="background-color: #455a64;" >
        <!-- menu de botones -->
        <div class="row items-center q-gutter-sm q-mb-md full-width " style="background-color: #455a63; padding: 10px; border-radius: 5px; min-height: 60px; ">
          <q-btn color="primary" class="text-white" @click="showCreateDialog = true">
            Crear
          </q-btn>

          <q-btn
            :color="selectionMode ? 'negative' : 'secondary'"
            class="text-white"
            @click="toggleSelectionMode"
          >
            {{ selectionMode ? 'Cancelar selección' : 'Seleccionar para eliminar' }}
          </q-btn>

          <q-btn
            color="negative"
            class="text-white"
            @click="showConfirmDialog = true"
            :disable="!selectionMode || selectedCardIndex === null"
          >
            Eliminar
          </q-btn>

          <q-btn
            color="secondary"
            class="text-white"
            @click="editarCard"
            disable
          >
            Editar
          </q-btn>
        </div>
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
          <q-input dense v-model="newCard.imagenURL" type="url" placeholder="URL" autofocus @keyup.enter="showCreateDialog = false" />
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