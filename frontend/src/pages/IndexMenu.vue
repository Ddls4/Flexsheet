<template>
  <q-page class=" flex  " >
    <!--  -->
    <div class="row q-pa-md bg-blue-grey-10 text-white " style="width: 100%; height: 100dvh; ">
        <div class="col-3 bg-blue-grey-9">
            <div class="row items-center q-gutter-sm q-mb-md full-width bg-blue-grey-5" style=" padding: 10px; border-radius: 5px; min-height: 60px; ">
                <label>filtro</label>
            </div>
        </div>
      <div class="col-9" style="background-color: #455a64;" >

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

  <q-dialog v-model="Testcard" persistent>
    <q-card style="min-width: 80vw; max-width: 90vw;">
      <q-card-section class="row">
        <!-- Lado izquierdo: Productos con checkboxes -->
        <div class="col-6 q-pa-md" style="border-right: 1px solid #ccc;">
          <div v-for="(product, index) in selectedCard?.products || []" :key="index" class="q-mb-md row items-center">
            <q-checkbox
              :model-value="isInCart(product)"
              @update:model-value="val => toggleProductSelection(product, val)"
              class="q-mr-sm"
            />
            <q-img
              :src="product.imagenURL"
              alt="Imagen del producto"
              style="width: 80px; height: 80px; object-fit: cover;"
              class="q-mr-md"
            />
            <div>
              <div class="text-subtitle2">{{ product.title }}</div>
              <div class="text-caption">Precio: ${{ product.price }}</div>
            </div>
          </div>
        </div>

        <!-- Lado derecho: Descripción del combo -->
        <div class="col-6 q-pa-md">
          <h5 class="q-mb-sm">{{ selectedCard?.title }}</h5>
          <p>{{ selectedCard?.description }}</p>
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
  import { ref, onMounted, reactive, computed, provide, inject   } from 'vue';

  import { useRouter } from 'vue-router'
  import { io } from "socket.io-client";

  const router = useRouter()
  
  const selectedCard = ref(null);
  const Testcard = ref(false);

  const selectedProducts = ref(new Set());

  const cards = ref([
    {
      id: 1,
      title: 'PoloLavadera',
      imagenURL: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg',
      description: 'Este combo incluye productos frescos y de calidad para el hogar.',
      products: [
        { title: 'Producto 1', price: 10, imagenURL: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg' },
        { title: 'Producto 2', price: 20, imagenURL: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg' },
        { title: 'Producto 3', price: 30, imagenURL: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg' },
      ]
    },
    {
      id: 2,
      title: 'Apolopintadero',
      imagenURL: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg',
      description: 'Ideal para el almuerzo familiar, incluye ingredientes frescos.',
      products: [
        { title: 'Producto A', price: 15, imagenURL: 'https://via.placeholder.com/100' },
        { title: 'Producto B', price: 25, imagenURL: 'https://via.placeholder.com/100' },
        { title: 'Producto C', price: 35, imagenURL: 'https://via.placeholder.com/100' },
      ]
    }
  ]); // Ejemplo de lo que trae la BD

  const selectedCardIndex = ref(null);
  const selectionMode = ref(false);

  const cardClicked = (index) => {
    selectedCard.value = cards.value[index];
    Testcard.value = true;
  };

  

  function toggleProductSelection(product, isSelected) {
    if (isSelected) {
      // Solo si no está ya agregado
      if (!shoppingCart.value.some(p => p.title === product.title)) {
        shoppingCart.value.push(product)
      }
    } else {
      // Quitar producto si se deselecciona
      const index = shoppingCart.value.findIndex(p => p.title === product.title)
      if (index !== -1) {
        shoppingCart.value.splice(index, 1)
      }
    }
  }

  // const shoppingCart = computed(() => Array.from(selectedProducts.value));

  const shoppingCart = inject('shoppingCart')
  if (!shoppingCart) {
    throw new Error('No se encontró el carrito (shoppingCart)')
  }
  function isInCart(product) {
    return shoppingCart.value.some(p => p.title === product.title)
  }


  onMounted(() => {

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