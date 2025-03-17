<template>
  <Title text="Clientes" />

  <div class="view-container">
    <div class="container" id="buscador-clientes">
      <div class="row">
        <div class="col-12">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Buscar..." 
            v-model="busqueda"
            @keyup="filtrarclientes"
          />
        </div>
      </div>
    </div>

    <div class="row mt-3" id="menu-clientes">
      <div class="col-6 d-flex align-items-center">
        <button @click="nuevoCliente" type="button" class="btn btn-primary btn-sm" id="btn-nuevocliente">Nuevo cliente</button>
      </div>
      <div class="col-6 d-flex justify-content-end align-items-center" style="padding-right: 2em;">
        <label for="registrosPorPagina" class="form-label me-2">Resultados por página:</label>
        <select 
          id="registrosPorPagina" 
          class="form-select form-select-sm w-auto" 
          v-model="registrosPorPagina"
          @change="cambiarRegistrosPorPagina"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="todos">Todos</option>
        </select>
      </div>
    </div>

    <div class="container mt-4" id="cont-tabla-clientes">
      <div class="tabla-scroll">
        <table class="table table-striped table-bordered text-center" id="tabla-clientes">
          <thead class="table-dark">
            <tr>
              <th @click="ordenarclientes('id')">
                ID
                <i :class="orden.columna === 'id' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarclientes('razon_social')">
                Razón social
                <i :class="orden.columna === 'name' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarclientes('direccion')">
                Dirección
                <i :class="orden.columna === 'direccion' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th>CUIT</th>
              <th>Tel.</th>
              <th @click="ordenarclientes('email')">
                Email
                <i :class="orden.columna === 'email' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cliente in clientesPaginados" :key="cliente.id">
              <td>{{ Number(cliente.id) }}</td>
              <td>{{ cliente.razon_social }}</td>
              <td>{{ cliente.direccion }}</td>
              <td>{{ cliente.cuit }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.email }}</td>
              


              <td>
                <button title="Usuarios asociados" type="button" class="btn --btn-verde me-1 btn-xs">
                  <i class="fa-solid fa-user-group"></i>
                </button>

                <button title="Ver más info" type="button" @click="verInfo(cliente)" class="btn btn-secondary me-1 btn-xs">
                  <i class="fa fa-info-circle"></i>
                </button>
                
                <button title="Editar cliente" type="button" class="btn btn-primary me-1 btn-xs">
                  <i class="fa fa-pencil"></i>
                </button>
                
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <nav aria-label="Paginación de tabla">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <a class="page-link" href="#" @click.prevent="paginaActual--" title="Página anterior">Anterior</a>
        </li>

        <li class="page-item" v-if="paginaActual > 3">
          <a class="page-link" href="#" @click.prevent="paginaActual = 1" title="Página">1</a>
        </li>

        <li class="page-item disabled" v-if="paginaActual > 4">
          <span class="page-link">...</span>
        </li>

        <li 
          class="page-item" 
          v-for="pagina in paginasMostradas" 
          :key="pagina" 
          :class="{ active: pagina === paginaActual }"
        >
          <a class="page-link" href="#" @click.prevent="paginaActual = pagina" title="Página {{ pagina }}">{{ pagina }}</a>
        </li>

        <li class="page-item disabled" v-if="paginaActual < totalPaginas - 3">
          <span class="page-link">...</span>
        </li>

        <li class="page-item" v-if="paginaActual < totalPaginas - 2">
          <a class="page-link"  title="Página {{ paginaActual }}" href="#" @click.prevent="paginaActual = totalPaginas">{{ totalPaginas }}</a>
        </li>

        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
          <a class="page-link"  title="Página siguiente" href="#" @click.prevent="paginaActual++">Siguiente</a>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Title from '/src/components/TitleMain.vue';
import api from "/src/api/api";

const clientes = ref([]);
const busqueda = ref('');
const registrosPorPagina = ref(25);
const paginaActual = ref(1);
const orden = ref({ columna: 'id', direccion: 'asc' });

onMounted(async () => {
  try {
    const { data } = await api.getClientes();
    clientes.value = data.map(cliente => ({
      ...cliente,
      id: Number(cliente.id)
    }));
  } catch (error) {
    console.error("Error al obtener clientes:", error);
  }
});
const paginasMostradas = computed(() => {
  const total = totalPaginas.value;
  const actual = paginaActual.value;
  
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 3) return [1, 2, 3, 4, 5];
  if (actual >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];

  return [actual - 2, actual - 1, actual, actual + 1, actual + 2];
});

const clientesFiltrados = computed(() => {
  return clientes.value
    .filter(u =>
      u.razon_social.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.direccion.toLowerCase().includes(busqueda.value.toLowerCase())
    )
    .sort((a, b) => {
      const [valA, valB] = [a[orden.value.columna], b[orden.value.columna]];
      return typeof valA === 'string' ? valA.localeCompare(valB) * (orden.value.direccion === 'asc' ? 1 : -1)
        : (valA - valB) * (orden.value.direccion === 'asc' ? 1 : -1);
    });
});
const totalPaginas = computed(() => {
  if (registrosPorPagina.value === 'todos') {
    return 1;
  }
  return Math.ceil(clientesFiltrados.value.length / registrosPorPagina.value);
});


const clientesPaginados = computed(() => {
  if (registrosPorPagina.value === 'todos') return clientesFiltrados.value;
  const start = (paginaActual.value - 1) * registrosPorPagina.value;
  return clientesFiltrados.value.slice(start, start + registrosPorPagina.value);
});

const ordenarclientes = (columna) => {
  orden.value = { columna, direccion: orden.value.columna === columna && orden.value.direccion === 'asc' ? 'desc' : 'asc' };
};
</script>


<style scoped>

#cont-tabla-clientes, #menu-clientes, #buscador-clientes{
  margin:0;
  padding:0;
  width:100%;
}

#menu-clientes{
  width:82vw;
  max-width:1350px
}
#tabla-clientes th:nth-child(1), #tabla-clientes td:nth-child(1){width:5%;}
#tabla-clientes th:nth-child(2), #tabla-clientes td:nth-child(2){width:27%;}
#tabla-clientes th:nth-child(3), #tabla-clientes td:nth-child(3){width:28%;}
#tabla-clientes th:nth-child(4), #tabla-clientes td:nth-child(4){width:12%;}
#tabla-clientes th:nth-child(5), #tabla-clientes td:nth-child(5){width:8%;}
#tabla-clientes th:nth-child(5), #tabla-clientes td:nth-child(6){width:5%;}
#tabla-clientes th:nth-child(5), #tabla-clientes td:nth-child(7){width:10%;}


</style>