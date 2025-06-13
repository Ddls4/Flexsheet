<template>
    <!-- PageTabla.vue | Esto mostrara la infromacion que trae de la BD -->
    <!-- Por ahora solo mostrara un hola mundo -->
    <q-btn label="Regresar" color="primary" :to="`/`" />
    <q-page class="flex flex-center">
        <h1>Hola Mundo</h1>
        <p>Esta es la página de la tabla.</p>
    </q-page>
    <div>
        <h2>Perfil de Usuario</h2>
        <p v-if="user">Nombre: {{ user.username }}</p>
        <p v-else>Cargando...</p>
    </div>
    
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';

    const user = ref(null);

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:80/user', { withCredentials: true });
            if (response.data.success) {
                user.value = response.data.user;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    });
</script>