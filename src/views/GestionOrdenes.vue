<template>
    <div>
      <Title text="Gestión de órdenes" />
      <div class="mx-5" v-for="orden in ordenes">{{ orden.id }}</div>
  
    </div>
  </template>
  
  <script setup>
  // Importa el componente Title
  import Title from '/src/components/TitleMain.vue';
  import { onMounted, ref } from 'vue';
  import apivue from '/src/api/apivue';
  const ordenes = ref([]);
  onMounted(async () => {
    try {
      const { data } = await apivue.getOrdenes();
      ordenes.value = data;
    } catch (error) {
      console.error("Error al obtener instrumentosclientes:", error);
    }
  })
  
  </script>
  
  <style scoped>

  </style>
  