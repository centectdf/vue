<template>
  <Title text="Instrumentos de clientes" />

  <div class="view-container">
    <div class="container" id="buscador-instrumentos-clientes">
      <div class="row">
        <div class="col-12">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Buscar..." 
            v-model="busqueda"
            @keyup="filtrarinstrumentosclientes"
          />
        </div>
      </div>
    </div>

    <div class="row mt-3" id="menu-instrumentos-clientes">
      <div class="col-6 d-flex align-items-center">
        <button @click="nuevoCliente" type="button" class="btn btn-primary btn-sm" id="btn-nuevoinstrumentocliente">Nuevo instrumento de cliente</button>
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

    <div class="container mt-4" id="cont-tabla-instrumentos-clientes">
      <div class="tabla-scroll">
        <table class="table table-striped table-bordered text-center" id="tabla-instrumentos-clientes">
          <thead class="table-dark">
            <tr>
              <th @click="ordenarinstrumentosclientes('id')">
                ID
                <i :class="orden.columna === 'id' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentosclientes('nro_serie')">
                N° de serie
                <i :class="orden.columna === 'nro_serie' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentosclientes('razon_social')">
                Razón social
                <i :class="orden.columna === 'razon_social' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentoslientes('tipo')">
                Tipo
                <i :class="orden.columna === 'tipo' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentoslientes('marca')">
                Marca
                <i :class="orden.columna === 'marca' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentoslientes('modelo')">
                Modelo
                <i :class="orden.columna === 'modelo' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarinstrumentoslientes('id_interno_empresa')">
                ID Cliente
                <i :class="orden.columna === 'id_interno_empresa' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="instrumentocliente in instrumentosClientesPaginados" :key="instrumentocliente.id">
              <td>{{ Number(instrumentocliente.id) }}</td>
              <td>{{ instrumentocliente.nro_serie }}</td>
              <td>{{ instrumentocliente.razon_social }}</td>
              <td>{{ instrumentocliente.tipo }}</td>
              <td>{{ instrumentocliente.marca }}</td>
              <td>{{ instrumentocliente.modelo }}</td>
              <td>{{ instrumentocliente.id_interno_empresa }}</td>
              


              <td>
                <button title="Duplicar registro" type="button" class="btn btn-secondary me-1 btn-xs">
                  <i class="fa-regular fa-clone"></i>
                </button>

                <button title="Ver más info" type="button" @click="verInfo(instrumentocliente)" class="btn btn-secondary me-1 btn-xs">
                  <i class="fa fa-info-circle"></i>
                </button>
                
                <button title="Editar" type="button" class="btn btn-primary me-1 btn-xs">
                  <i class="fa fa-pencil"></i>
                </button>

                <button title="Eliminar" type="button" class="btn btn-danger me-1 btn-xs">
                  <i class="fa fa-trash"></i>
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

const instrumentosclientes = ref([]);
const busqueda = ref('');
const registrosPorPagina = ref(25);
const paginaActual = ref(1);
const orden = ref({ columna: 'id', direccion: 'asc' });

onMounted(async () => {
  try {
    const { data } = await api.getInstrumentosClientes();
    instrumentosclientes.value = data.map(instrumentocliente => ({
      ...instrumentocliente,
      id: Number(instrumentocliente.id)
    }));
  } catch (error) {
    console.error("Error al obtener instrumentosclientes:", error);
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

const instrumentosClientesFiltrados = computed(() => {
  return instrumentosclientes.value
    .filter(u =>
      u.nro_serie.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.razon_social.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.tipo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.marca.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.modelo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      u.id_interno_empresa?.toLowerCase().includes(busqueda.value.toLowerCase())
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
  return Math.ceil(instrumentosClientesFiltrados.value.length / registrosPorPagina.value);
});


const instrumentosClientesPaginados = computed(() => {
  if (registrosPorPagina.value === 'todos') return instrumentosClientesFiltrados.value;
  const start = (paginaActual.value - 1) * registrosPorPagina.value;
  return instrumentosClientesFiltrados.value.slice(start, start + registrosPorPagina.value);
});

const ordenarinstrumentosclientes = (columna) => {
  orden.value = { columna, direccion: orden.value.columna === columna && orden.value.direccion === 'asc' ? 'desc' : 'asc' };
};
</script>
