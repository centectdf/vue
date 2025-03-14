<!--https://www.youtube.com/watch?v=3xBeFyLXCTk-->

<template>
    <div>
      <h2>Tablero Kanban</h2>
  
      <!-- Mostrar las órdenes obtenidas de la base de datos -->
      <div class="kanban-board">
        <div class="kanban-column" v-for="column in columns" :key="column.id">
          <h3>{{ column.name }}</h3>
          <div class="kanban-card" v-for="card in column.cards" :key="card.id">
            <h4>{{ card.titulo }}</h4>
            <p>{{ card.descripcion }}</p>
            <!-- Aquí puedes agregar más detalles de las tarjetas -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import apivue from "/src/api/apivue";
  
  // Definir las columnas del Kanban
  const columns = ref([
    { id: 1, name: 'En Espera', cards: [] },
    { id: 2, name: 'Ingresado', cards: [] },
    { id: 3, name: 'En proceso', cards: [] },
    { id: 4, name: 'Calibración finalizada', cards: [] },
    { id: 5, name: 'Certificado emitido', cards: [] },
    { id: 6, name: 'Certificado aprobado', cards: [] }

  ]);
  
  // Cargar las órdenes desde la base de datos
  const cargarOrdenes = async () => {
    try {
      const data = await apivue.getGestionOrdenes();
      console.log(data.data)

      organizarOrdenesEnColumnas(data.data);
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
    }
  };
  
  // Organizar las órdenes en las columnas del Kanban
  const organizarOrdenesEnColumnas = (ordenes) => {
    ordenes.forEach((orden) => {
      // Aquí puedes implementar la lógica de clasificación según el estado de cada orden
      if (orden.id_estado === 7) {
        columns.value[0].cards.push(orden);
      } else if (orden.id_estado === 1) {
        columns.value[1].cards.push(orden);
      } else if (orden.id_estado === 2) {
        columns.value[2].cards.push(orden);
      } else if (orden.id_estado === 3) {
        columns.value[3].cards.push(orden);
      } else if (orden.id_estado === 4) {
        columns.value[4].cards.push(orden);
      } else if (orden.id_estado === 8) {
        columns.value[5].cards.push(orden);
      }
    });


  };
  
  // Cargar las órdenes cuando el componente se monte
  onMounted(() => {
    cargarOrdenes();
  });
  </script>
  
  <style scoped>
  .kanban-board {
    display: flex;
    gap: 20px;
  }
  
  .kanban-column {
    width: 300px;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 8px;
  }
  
  .kanban-card {
    background-color: #fff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  h4 {
    margin: 0;
    font-size: 16px;
  }
  
  p {
    font-size: 14px;
    color: #555;
  }
  
  .kanban-column h3 {
    font-size: 18px;
    margin-bottom: 10px;
    text-align: center;
  }
  </style>
  