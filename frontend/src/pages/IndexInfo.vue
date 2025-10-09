<template>
  <q-page class=" flex  " >
    <div class="column q-pa-md bg-blue-grey-10 text-white " style="width: 100%; height: 100dvh; ">

      <div class="col-6 bg-blue-grey-7">
        <div class="text-center q-mb-md" style="color: white;">
          <div style="padding: 10vh;">
              <q-label class="text-h2 text-weight-bolder">AltaShop</q-label>
          </div>
            <div class="text-center q-mb-md white" style="margin: 30px;">   
                <q-label class="text-body1 text-center" style="margin: 5px;">
                    Somos un grupo de emprendedores que te invita a dar el salto al mundo digital, abriendo las puertas de tu negocio a nuevas oportunidades en internet.
                </q-label>
            </div>
        </div>
      </div>
      <div class="col-6 bg-blue-grey-8">
            <div class="text-center q-mb-md white" style="margin: 50px;">   
                <q-label class="text-body1 text-center" style="margin: 10px;">Para empezar a usar la aplicación aprete en productos
                Puedes ir a opciones para modificar a tu gusto la web. <br>
                Al apretar en productos podras ver los productos que tenemos para ofrecerte y agregar al carrito
                </q-label>




                <div v-if="user" class=" bg-blue-grey-6">
                      <h4 color="blue">Bienvenido, {{ user.nombre }}</h4>
                      <p color="blue">Tu ID es: {{ user.id }}</p>
                    </div>
                    <div v-else>
                      <q-banner type="warning" color="blue">No hay usuario logueado</q-banner>
                </div>



                
            </div>
      </div>

    </div>

  </q-page>
</template>

<script setup>
  import { ref, onMounted } from 'vue';

  const user = ref(null);

  onMounted(() => {
    const data = localStorage.getItem('user');
    if (data) {
      try {
        user.value = JSON.parse(data);
      } catch (e) {
        console.error('Error al leer localStorage:', e);
      }
    }
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