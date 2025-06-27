<template>
    <div class="main">
        <div class="row">
            <aside class="sidebar border-right col-3 menu">
                <h2>Configuración</h2>
                <!-- Column Configuration -->
                <div>
                    <label for="columnCount">Cantidad de Columnas:</label>
                    <q-input v-model.number="columnCount" type="number" />
                    <button @click="generateColumnInputs">Generar Columnas</button>
                </div>

                <!-- Column Name Inputs -->
                <div v-for="(name, index) in columnNames" :key="index">
                    <input v-model="columnNames[index]" :placeholder="`Columna ${index + 1}`" />
                </div>
                <!-- Create Table -->
                <button @click="createTable">Crear Tabla</button>
                <!-- Row Inputs -->
                <div v-if="tableData.columns.length">
                    <h2>Agregar Información</h2>
                    <div v-for="(col, i) in tableData.columns" :key="i">
                        <input v-model="newRow[i]" :placeholder="`Dato ${col}`" />
                    </div>
                    <button @click="addRow">Agregar Fila</button>
                </div>

                <button @click="guardarTablaEnBD">Guardar en Base de Datos</button>
            </aside>

            <main class="col-8">
                <h3 style="color: aliceblue;">
                    <span id="welcomeMessage"></span>
                </h3>
                <table v-if="tableData.columns.length">
                    <thead>
                        <tr>
                            <th v-for="(col, i) in tableData.columns" :key="i">{{ col }}</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in tableData.rows" :key="rowIndex">
                            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                                <span v-if="editIndex !== rowIndex">{{ cell }}</span>
                                <input v-else v-model="tableData.rows[rowIndex][cellIndex]" />
                            </td>
                            <td>
                                <button v-if="editIndex !== rowIndex" @click="editRow(rowIndex)">Editar</button>
                                <button v-else @click="saveRow(rowIndex)">Guardar</button>
                                <button @click="deleteRow(rowIndex)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
    </div>
    
</template>

<script setup>
    import { ref,reactive, onMounted } from 'vue';
    import axios from 'axios';

    const columnCount = ref(0);
    const columnNames = ref([]);
    const tableData = reactive({
        columns: [],
        rows: []
    });
    const newRow = ref([]);
    const editIndex = ref(null);


    onMounted(async () => {
        try {
            const response = await axios.get('http://${import.meta.env.Web_P_IP}:80/user', { withCredentials: true });
            if (response.data.success) {
                user.value = response.data.user;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    });
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
    const guardarTablaEnBD = async () => {
    try {
        const response = await axios.post(`http://${import.meta.env.VITE_P_IP}:80/guardar-tabla`, {
            card_id: 1, // Aquí deberías pasar el `card_id` real que corresponda
            rows: tableData.rows
        }, {
            withCredentials: true
        });

        if (response.data.success) {
            alert('Datos guardados exitosamente');
        } else {
            alert('Error al guardar los datos');
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error de conexión al guardar los datos');
    }
};
</script>

<style>
*{padding: 0%;margin: 0%;box-sizing: border-box;}
.main{
    width: 100%;
    height: 100vh;
    background-color: rgba(31,31,31,255);
}
.menu{
    height: 90vh;
    background-color: #232523;
}
.titulo{
    color: #ddd;
    font-weight: bold;
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
}
#config-form{
    width: 100%;
}


.menu h2{
    text-align: center;
    color: #fff;
    font-weight: bold;
}
.menu button{
    width: 90%;
    height: 30px;
    margin-left: 10px;
    text-align: center;
    border-radius: 10%/95%;
    font-weight: bold;
}

.input-group {
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
}
.input-group input {
    margin-left: 2px;
    width: 15%;
    text-align: center;
}
.generador_input{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;
}
.generador_input input{
    width: 80%;
    margin-left: 10px;
}
.rowInputs{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-left: 10px;
}
.rowInputs input{
    width: 80%;
    margin-left: 10px;
}

#Tabla-columnsa{
    border-collapse: collapse;
    margin-bottom: 20px;
    width: 100%;
}
table {
    border-collapse: collapse;
    margin-bottom: 20px;
    width: 100%;
    border: 1px solid rgb(255, 255, 255);
    text-align: center;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    color: #ddd;
}

th {
    background-color: #4CAF50;
    color: #fff;    
}

.hidden {
    display: none;
}
</style>