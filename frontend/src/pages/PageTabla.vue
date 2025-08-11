<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-9">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
  
          <q-card class="col-md-3 col-sm-12 bg-grey-8 text-white">
            <q-card-section>
              <h2 class="text-h5 q-mt-none q-mb-md">Configuración</h2>

              <q-form @submit.prevent="generateColumnInputs" class="q-gutter-md">
                <q-input
                  filled
                  dark
                  color="white"
                  v-model.number="columnCount"
                  type="number"
                  label="Cantidad de Columnas"
                  min="1"
                  :rules="[val => val > 0 || 'Debe tener al menos 1 columna']"
                />
                
                <q-btn 
                  label="Generar Columnas" 
                  type="submit"
                  color="primary"
                  class="full-width"
                />
              </q-form>

              <div v-if="columnNames.length" class="q-mt-lg">
                <h3 class="text-h6 q-mb-sm">Nombres de Columnas</h3>
                <q-input
                  v-for="(name, index) in columnNames"
                  :key="index"
                  v-model="columnNames[index]"
                  dark
                  filled
                  color="white"
                  :label="`Columna ${index + 1}`"
                  class="q-mb-sm"
                />
                
                <q-btn 
                  label="Crear Tabla" 
                  @click="createTable"
                  color="positive"
                  class="full-width q-mt-md"
                />
              </div>

              <div v-if="tableData.columns.length" class="q-mt-lg">
                <h3 class="text-h6 q-mb-sm">Agregar Fila</h3>
                <q-input
                  v-for="(col, i) in tableData.columns"
                  :key="i"
                  v-model="newRow[i]"
                  dark
                  filled
                  color="white"
                  :label="col"
                  class="q-mb-sm"
                />
                
                <q-btn 
                  label="Agregar Fila" 
                  @click="addRow"
                  color="primary"
                  class="full-width"
                />
              </div>

              <q-btn 
                label="Guardar en Base de Datos" 
                @click="guardarTablaEnBD"
                color="green"
                class="full-width q-mt-lg"
              />
            </q-card-section>
          </q-card>

          <div class="col-md-9 col-sm-12">
            <q-card class="bg-grey-8 text-white">
              <q-card-section>
                <h3 class="text-h5 q-mt-none">Vista Previa de la Tabla</h3>
                
                <div v-if="tableData.columns.length">
                  <q-table
                    flat
                    bordered
                    dark
                    :rows="tableData.rows"
                    :columns="tableColumns"
                    row-key="index"
                    hide-pagination
                    :pagination="{ rowsPerPage: 0 }"
                    class="q-mt-md"
                  >
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <q-btn 
                          v-if="editIndex !== props.row.index"
                          icon="edit"
                          color="info"
                          dense
                          round
                          @click="editRow(props.row.index)"
                          class="q-mr-xs"
                        />
                        <q-btn 
                          v-else
                          icon="save"
                          color="positive"
                          dense
                          round
                          @click="saveRow(props.row.index)"
                          class="q-mr-xs"
                        />
                        <q-btn 
                          icon="delete"
                          color="negative"
                          dense
                          round
                          @click="deleteRow(props.row.index)"
                        />
                      </q-td>
                    </template>
                  </q-table>
                </div>
                
                <div v-else class="text-center q-pa-lg">
                  <q-icon name="table_chart" size="xl" color="grey-5" />
                  <p class="text-grey-5 q-mt-sm">No hay datos para mostrar. Configura tu tabla primero.</p>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const tableData = reactive({
      columns: [],
      rows: []
    });
    const isLoading = ref(true);
    const error = ref(null);
    const columnCount = ref(0); // Añadido esto
    const columnNames = ref([]); // Asegurarse que está definido
    const newRow = ref([]);
    const editIndex = ref(null);
    
    const socket = io(`http://${import.meta.env.VITE_P_IP}:80`, {
      withCredentials: true,
      reconnection: true
    });

    // Columnas computadas para la tabla
    const tableColumns = computed(() => {
      return [
        ...tableData.columns.map((col, index) => ({
          name: col,
          required: true,
          label: col,
          align: 'center',
          field: row => row[index],
          sortable: true
        })),
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          field: 'actions'
        }
      ];
    });

    const fetchTableData = () => {
      const title = route.query.name;
      const id = route.query.id;

      if (!title || !id) {
        error.value = "Faltan parámetros en la URL";
        isLoading.value = false;
        return;
      }

      isLoading.value = true;
      error.value = null;
      
      new Promise((resolve, reject) => {
        socket.emit("solicitar_tabla", { title, id }, (response) => {
          if (response?.success) {
            resolve(response);
          } else {
            reject(response?.message || "Error desconocido");
          }
        });
      })
      .then(response => {
        Object.assign(tableData, response);
        columnCount.value = response.columns.length; // Actualizar columnCount
        columnNames.value = [...response.columns]; // Actualizar columnNames
        isLoading.value = false;
      })
      .catch(err => {
        error.value = err;
        isLoading.value = false;
        console.error("Error al cargar tabla:", err);
      });
    };

    function generateColumnInputs() {
      columnNames.value = Array.from({ length: columnCount.value }, (_, i) => columnNames.value[i] || '');
    }

    function createTable() {
      tableData.columns = [...columnNames.value];
      tableData.rows = [];
      newRow.value = Array(columnNames.value.length).fill('');
    }

    function addRow() {
      if (newRow.value.length !== tableData.columns.length) return;
      tableData.rows.push([...newRow.value]);
      newRow.value = Array(tableData.columns.length).fill('');
    }

    function editRow(index) {
      editIndex.value = index;
    }

    function saveRow(index) {
      editIndex.value = null;
    }

    function deleteRow(index) {
      tableData.rows.splice(index, 1);
    }

async function guardarTablaEnBD() {
  console.log('Guardando tabla en BD...', route.query.id);
  if (!route.query.id) {
    alert('No se pudo determinar el ID de la card.');
    return;
  }

  try {
    // Usar Socket.IO en lugar de Axios
    const response = await new Promise((resolve, reject) => {
      socket.emit("guardar_tabla", {
        card_id: route.query.id,
        columns: tableData.columns,
        rows: tableData.rows
      }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(response.message);
        }
      });
    });

    alert('Datos guardados exitosamente');
  } catch (error) {
    console.error('Error al guardar:', error);
    alert(`Error al guardar: ${error}`);
  }
}

    onMounted(() => {
      fetchTableData();
      
      socket.on("connect_error", (err) => {
        error.value = "Error de conexión con el servidor";
        console.error("Error de conexión:", err);
      });
    });

    onUnmounted(() => {
      socket.off("connect_error");
      if (socket.connected) {
        socket.disconnect();
      }
    });

    return {
      columnCount,
      columnNames,
      tableData,
      newRow,
      editIndex,
      tableColumns,
      isLoading,
      error,
      generateColumnInputs,
      createTable,
      addRow,
      editRow,
      saveRow,
      deleteRow,
      guardarTablaEnBD
    };
  }
};
</script>

<style lang="scss">
.q-header {
  background: linear-gradient(145deg, #2e7d32 0%, #1b5e20 100%);
}

.q-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.2);
}

.q-table {
  border-radius: 8px;
  overflow: hidden;
  
  thead tr {
    background: linear-gradient(145deg, #2e7d32 0%, #1b5e20 100%);
  }
  
  tbody tr:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.q-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>