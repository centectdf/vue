<template>
  <Title text="Órdenes" />
  
  <div class="view-container">
    <div class="row mt-3" id="menu-ordenes">
      <!-- Buscador: -->
      <div class="container" id="buscador-ordenes">
        <div class="row">
          <div class="col-12">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar..." 
              v-model="busqueda"
              @keyup="filtrarOrdenes"
            />
          </div>
        </div>
      </div>
      <!-- Botón nuevo orden: -->
       <div class="col-12 d-flex justify-content-between" id="submenu-tabla-ordenes">
          <!-- <div>
            <button @click="nuevoUsuario" type="button" class="btn btn-primary btn-sm" id="btn-nuevoorden">Nuevo orden</button>
          </div> -->
          <!-- Filtrar resultados por página: -->
          <div class="d-flex justify-content-end align-items-center">
            <label for="registrosPorPagina" class="form-label me-2">Resultados por página:</label>
            <select id="registrosPorPagina" class="form-select form-select-sm w-auto" v-model="registrosPorPagina" @change="cambiarRegistrosPorPagina">
              <option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="todos">Todos</option>
            </select>
          </div>
      </div>
    </div>

    <div class="container mt-4" id="cont-tabla-ordenes">
      <div class="tabla-scroll">
        <table class="table table-striped table-bordered text-center" id="tabla-ordenes">
          <thead class="table-dark">
            <tr>
              <!-- <th @click="ordenarOrdenes('id')"> -->
                <th>
                N°
                <!-- <i :class="orden.columna === 'id' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i> -->
              </th>
              <th>Nota Ingreso</th>
              <th>Fecha Ingreso</th>
              <th>Fecha Pactada</th>
              <th>Cliente</th>
              <th>Instrumento</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Acciones</th>

              <!-- <th @click="ordenarOrdenes('name')">
                Nombre de orden
                <i :class="orden.columna === 'name' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarOrdenes('email')">
                Email (login)
                <i :class="orden.columna === 'email' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th> -->
              
            </tr>
          </thead>

          <tbody>
            <tr class="table-hover" v-for="norden in ordenesPaginados" :key="norden.orden">
              <td>{{ Number(norden.orden) }}</td>
              <td>{{ norden.remito_in }}</td>
              <td>{{ norden.fecha }}</td>
              <td>{{ norden.fecha }}</td>
              <td>{{ norden.id_cliente }}</td>
              <td>{{ norden.id_instrumento }}</td>
              <td>{{ norden.Estado }}</td>
              <td>{{ norden.Ubicacion }}</td>
              <td>
                <button title="Acciones" type="button" class="btn-acciones btn btn-dark btn-xs"
                        @click.stop="toggleAcciones($event, orden)">
                  <i class="fa-solid fa-bars menu-icon"></i>
                </button>
                <div>
                  <ul class="acciones" v-if="mostrarAcciones" :style="{ top: `${posY}px`, left: `${posX}px` }">
                    <li class="px-4 py-1" aria-label="Ver información" @click="testOrden(norden)">Ver información</li>
                    <li class="px-4 py-1" aria-label="Editar orden" @click="editarOrden(norden)">Editar orden</li>
                    <li class="px-4 py-1" aria-label="Eliminar orden">Eliminar orden</li>
                  </ul> 
                </div>
              </td>


              
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
        :pagina-actual="paginaActual"
        :total-paginas="totalPaginas"
        @cambiar-pagina="cambiarPagina"
      />



  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue';
import { usePagination } from '/src/composables/usePagination';
import Pagination from '/src/components/Pagination.vue';
import Title from '/src/components/TitleMain.vue';
import api from "/src/api/api";

const ordenes = ref([]);
const busqueda = ref('');
const registrosPorPagina = ref(25);
//const orden = ref({ columna: 'id', direccion: 'asc' });

onMounted(async () => {
  try {
    const { data } = await api.getOrdenes();
    ordenes.value = data.map(norden => ({
      ...norden,
      orden: Number(norden.orden)
    }));
  } catch (error) {
    console.error("Error al obtener ordenes:", error);
  }
});

const ordenesFiltrados = computed(() => {
  //const busquedaLower = busqueda.value.toLowerCase();
  return ordenes.value
    // .filter(u =>
    //   u.name.toLowerCase().includes(busquedaLower) ||
    //   u.email.toLowerCase().includes(busquedaLower)
    // )
    // .sort((a, b) => {
    //   const [valA, valB] = [a[norden.value.columna], b[norden.value.columna]];
    //   return typeof valA === 'string'
    //     ? valA.localeCompare(valB) * (norden.value.direccion === 'asc' ? 1 : -1)
    //     : (valA - valB) * (norden.value.direccion === 'asc' ? 1 : -1);
    // });
});

// Usamos el composable usePagination
const { 
  paginaActual, 
  totalPaginas, 
  itemsPaginados: ordenesPaginados, 
  cambiarPagina 
} = usePagination(ordenesFiltrados, registrosPorPagina);

// const ordenarOrdenes = (columna) => {
//   orden.value = { columna, direccion: orden.value.columna === columna && orden.value.direccion === 'asc' ? 'desc' : 'asc' };
// };

const cambiarRegistrosPorPagina = () => {
  if (registrosPorPagina.value !== 'todos') {
    registrosPorPagina.value = parseInt(registrosPorPagina.value, 10);
  }
};

const mostrarAcciones = ref(false);
const posX = ref(0);
const posY = ref(0);
const ordenSeleccionado = ref(null);

const toggleAcciones = (event, orden) => {
  if (mostrarAcciones.value && ordenSeleccionado.value === orden) {
    mostrarAcciones.value = false;
    ordenSeleccionado.value = null;
  } else {
    ordenSeleccionado.value = orden;
    mostrarAcciones.value = true;

    // Usar nextTick para calcular el tamaño del menú después de que Vue lo renderice
    setTimeout(() => {
      const menu = document.querySelector(".acciones");
      if (menu) {
        const menuWidth = menu.offsetWidth;
        posX.value = event.clientX - menuWidth; // Ajuste para la esquina derecha
        posY.value = event.clientY; // Mantiene la parte superior alineada con el clic
      }
    }, 0);
  }
};

onMounted(() => {
  document.addEventListener("click", function(event) {
    if (!event.target.closest(".btn-acciones") && !event.target.closest(".acciones")) {
      mostrarAcciones.value = false;
      ordenSeleccionado.value = null;
    }
  });
});


const testOrden = (norden) => {
  console.log(norden)
}

// function editarUsuario(orden) {
//   // Asignar valores a los campos
//   document.getElementById('idUsuario').textContent = orden.id;
//   document.getElementById('nombreUsuario').value = orden.name;
//   document.getElementById('emailUsuario').value = orden.email;

//   // Limpiar checkboxes antes de marcarlos
//   document.querySelectorAll('.form-check-input').forEach(cb => cb.checked = false);

//   // Marcar los checkboxes según los perfiles del orden
//   orden.perfiles.forEach(perfil => {
//     let checkbox = document.querySelector(`.form-check-input[value="${perfil}"]`);
//     if (checkbox) checkbox.checked = true;
//   });

//   // Mostrar el modal
//   var myModal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
//   myModal.show();
// }


</script>

<style scoped>
  #cont-tabla-ordenes, #menu-ordenes, #buscador-ordenes{
    margin:0;
    padding:0;
    width:100%;
  }
  #buscador-ordenes{
    margin-bottom:2em;
    margin-top:-1em
  }

  #menu-ordenes{
    width:82vw;
    max-width:1350px
  }


  /* #tabla-ordenes th:nth-child(1), #tabla-ordenes td:nth-child(1){width:8%;}
  #tabla-ordenes th:nth-child(2), #tabla-ordenes td:nth-child(2){width:32%;}
  #tabla-ordenes th:nth-child(3), #tabla-ordenes td:nth-child(3){width:30%;}
  #tabla-ordenes th:nth-child(4), #tabla-ordenes td:nth-child(4){width:10%;}
  #tabla-ordenes th:nth-child(5), #tabla-ordenes td:nth-child(5){width:30%;} */

  #label-id{
    margin-right:0.5em;
  }

  .btn-acciones{
      display:block;
      justify-self:center;
    }

  @media screen and (max-width: 1030px) {
      .grupo-btn{
        display:none;
      }

      /* Fijar la segunda columna (columna 2) a la izquierda */
      td:nth-child(2), th:nth-child(2) {
        position: sticky;
        left: 0;
      }
      thead th{
        position:unset;
      }

      .acciones li{
        padding:1em;
      }
    }

  @media screen and (max-width: 590px) {
    #submenu-tabla-ordenes{
        flex-direction:column;
        width:90%;
      }
      #submenu-tabla-ordenes div{
        width:100%;
        display:flex;

      }
      #submenu-tabla-ordenes div button{
        width:100%;
        margin-bottom:1em;

      }
      
    }

</style>