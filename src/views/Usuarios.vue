<template>
  <Title text="Usuarios" />
  
  <div class="view-container">
    <div class="row mt-3" id="menu-usuarios">
      <!-- Buscador: -->
      <div class="container" id="buscador-usuarios">
        <div class="row">
          <div class="col-12">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar..." 
              v-model="busqueda"
              @keyup="filtrarUsuarios"
            />
          </div>
        </div>
      </div>
       <div class="col-12 d-flex justify-content-between" id="submenu-tabla-usuarios">
        <!-- Botón nuevo usuario: -->
          <div>
            <button @click="nuevoUsuario" type="button" class="btn btn-primary btn-sm" id="btn-nuevousuario">Nuevo usuario</button>
          </div>
          <!-- Filtrar resultados por página: -->
          <div class="d-flex justify-content-end align-items-center">
            <label for="registrosPorPagina" class="form-label me-2">Resultados por página:</label>
            <select id="registrosPorPagina" class="form-select form-select-sm w-auto" v-model="registrosPorPagina" @change="cambiarRegistrosPorPagina">
              <option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="todos">Todos</option>
            </select>
          </div>
      </div>
    </div>

    <div class="container mt-4" id="cont-tabla-usuarios">
      <div class="tabla-scroll">
        <table class="table table-striped table-bordered text-center" id="tabla-usuarios">
          <thead class="table-dark">
            <tr>
              <th @click="ordenarUsuarios('id')">
                ID
                <i :class="orden.columna === 'id' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarUsuarios('name')">
                Nombre de usuario
                <i :class="orden.columna === 'name' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th @click="ordenarUsuarios('email')">
                Email (login)
                <i :class="orden.columna === 'email' ? (orden.direccion === 'asc' ? 'fa-solid fa-arrow-down-wide-short' : 'fa-solid fa-arrow-up-wide-short') : ''"></i>
              </th>
              <th>Perfiles</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="usuario in usuariosPaginados" :key="usuario.id">
              <td>{{ Number(usuario.id) }}</td>
              <td>{{ usuario.name }}</td>
              <td>{{ usuario.email }}</td>
              <td v-if="usuario.perfiles && usuario.perfiles.length">
                <span v-for="(perfil, index) in usuario.perfiles" :key="index" class="badge bg-secondary me-1">
                  {{ perfil }}
                </span>
              </td>
              <td v-else></td>


              <td>
                <button title="Ver información" type="button" @click="testUser(usuario)" class="grupo-btn btn btn-secondary me-1 btn-xs">
                  <i class="fa fa-info-circle"></i>
                </button>
                
                <button title="Editar usuario" type="button" @click="editarUsuario(usuario)" class="grupo-btn btn btn-primary me-1 btn-xs">
                  <i class="fa fa-pencil"></i>
                </button>
                
                <button title="Eliminar usuario" type="button" @click="borrarUsuario(usuario)" class="grupo-btn btn btn-danger me-1 btn-xs">
                  <i class="fa fa-trash"></i>
                </button>
                
                <button title="Reiniciar contraseña" type="button" class="grupo-btn btn btn-primary me-1 btn-xs">
                  <i class="fa-solid fa-rotate-right"></i>
                </button>
                
                <button title="Loguearse como usuario" type="button" class="grupo-btn btn btn-dark btn-xs">
                  <i class="fa fa-user"></i>
                </button>
                <button title="Acciones" type="button" class="btn-acciones btn btn-dark btn-xs"
                        @click.stop="toggleAcciones($event, usuario)">
                  <i class="fa-solid fa-bars menu-icon"></i>
                </button>

                <div>
                  <ul class="acciones" v-if="mostrarAcciones" :style="{ top: `${posY}px`, left: `${posX}px` }">
                    <li aria-label="Ver información" @click="testUser(usuarioSeleccionado)">Ver información</li>
                    <li aria-label="Editar usuario" @click="editarUsuario(usuarioSeleccionado)">Editar usuario</li>
                    <li aria-label="Eliminar usuario">Eliminar usuario</li>
                    <li aria-label="Reiniciar contraseña">Reiniciar contraseña</li>
                    <li aria-label="Loguearse como usuario">Loguearse como usuario</li>
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


    <!-- Modal | Editar Usuario -->
      <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Editar Usuario</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label class="form-label" id="label-id">ID de usuario: </label><span id="idUsuario" class="fw-bold"></span>
                </div>
                <!-- Nombre -->
                <div class="mb-3">
                  <label for="nombreUsuario" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="nombreUsuario">
                </div>
                
                <!-- Email -->
                <div class="mb-3">
                  <label for="emailUsuario" class="form-label">Email</label>
                  <input type="email" class="form-control" id="emailUsuario">
                </div>

                <!-- Perfiles -->
                <div class="mb-3">
                  <label class="form-label">Perfiles</label>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="perfil1" value="Administrador">
                    <label class="form-check-label" for="perfil1">Coordinador del sistema</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="perfil2" value="Jefe de Laboratorio">
                    <label class="form-check-label" for="perfil2">Jefes de los laboratorios de CENTEC</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="perfil3" value="Operador">
                    <label class="form-check-label" for="perfil3">Operador de Laboratorio</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="perfil4" value="Sujeto Prueba">
                    <label class="form-check-label" for="perfil4">Se crea para realizar la validación del SW</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="perfil5" value="Cliente">
                    <label class="form-check-label" for="perfil5">Perfil de cliente</label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    <!-- Fin Modal -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted} from 'vue';
import { usePagination } from '/src/composables/usePagination';
import Pagination from '/src/components/Pagination.vue';
import Title from '/src/components/TitleMain.vue';
import api from "/src/api/api";

const usuarios = ref([]);
const busqueda = ref('');
const registrosPorPagina = ref(25);
const orden = ref({ columna: 'id', direccion: 'asc' });

onMounted(async () => {
  try {
    const { data } = await api.getUsuarios();
    usuarios.value = data.map(usuario => ({
      ...usuario,
      id: Number(usuario.id),
      perfiles: usuario.perfiles ? usuario.perfiles.split(', ') : []
    }));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
});

const usuariosFiltrados = computed(() => {
  const busquedaLower = busqueda.value.toLowerCase();
  return usuarios.value
    .filter(u =>
      u.name.toLowerCase().includes(busquedaLower) ||
      u.email.toLowerCase().includes(busquedaLower)
    )
    .sort((a, b) => {
      const [valA, valB] = [a[orden.value.columna], b[orden.value.columna]];
      return typeof valA === 'string'
        ? valA.localeCompare(valB) * (orden.value.direccion === 'asc' ? 1 : -1)
        : (valA - valB) * (orden.value.direccion === 'asc' ? 1 : -1);
    });
});

// Usamos el composable usePagination
const { 
  paginaActual, 
  totalPaginas, 
  itemsPaginados: usuariosPaginados, 
  cambiarPagina 
} = usePagination(usuariosFiltrados, registrosPorPagina);

const ordenarUsuarios = (columna) => {
  orden.value = { columna, direccion: orden.value.columna === columna && orden.value.direccion === 'asc' ? 'desc' : 'asc' };
};

const cambiarRegistrosPorPagina = () => {
  if (registrosPorPagina.value !== 'todos') {
    registrosPorPagina.value = parseInt(registrosPorPagina.value, 10);
  }
};

const mostrarAcciones = ref(false);
const posX = ref(0);
const posY = ref(0);
const usuarioSeleccionado = ref(null);

const toggleAcciones = (event, usuario) => {
  if (mostrarAcciones.value && usuarioSeleccionado.value === usuario) {
    mostrarAcciones.value = false;
    usuarioSeleccionado.value = null;
  } else {
    usuarioSeleccionado.value = usuario;
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
      usuarioSeleccionado.value = null;
    }
  });
});


const testUser = (usuario) => {
  console.log(usuario)
};

function editarUsuario(usuario) {
  // Asignar valores a los campos
  document.getElementById('idUsuario').textContent = usuario.id;
  document.getElementById('nombreUsuario').value = usuario.name;
  document.getElementById('emailUsuario').value = usuario.email;

  // Limpiar checkboxes antes de marcarlos
  document.querySelectorAll('.form-check-input').forEach(cb => cb.checked = false);

  // Marcar los checkboxes según los perfiles del usuario
  usuario.perfiles.forEach(perfil => {
    let checkbox = document.querySelector(`.form-check-input[value="${perfil}"]`);
    if (checkbox) checkbox.checked = true;
  });

  // Mostrar el modal
  var myModal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
  myModal.show();
}


</script>

<style scoped>
#btn-nuevousuario{margin-left: 2em;padding:0.4em 1em 0.5em 1em;}
  #cont-tabla-usuarios, #menu-usuarios, #buscador-usuarios{
    margin:0;
    padding:0;
    width:100%;
  }
  #buscador-usuarios{
    margin-bottom:2em;
    margin-top:-1em
  }

  #menu-usuarios{
    width:82vw;
    max-width:1350px
  }

  #tabla-usuarios th:nth-child(1), #tabla-usuarios td:nth-child(1){width:8%;}
  #tabla-usuarios th:nth-child(2), #tabla-usuarios td:nth-child(2){width:32%;}
  #tabla-usuarios th:nth-child(3), #tabla-usuarios td:nth-child(3){width:30%;}
  #tabla-usuarios th:nth-child(4), #tabla-usuarios td:nth-child(4){width:10%;}
  #tabla-usuarios th:nth-child(5), #tabla-usuarios td:nth-child(5){width:30%;}

  #label-id{
    margin-right:0.5em;
  }


  @media screen and (max-width: 1030px) {
    .btn-acciones{
      display:block;
    }
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
    #submenu-tabla-usuarios{
        flex-direction:column;
        width:90%;
      }
      #submenu-tabla-usuarios div{
        width:100%;
        display:flex;

      }
      #submenu-tabla-usuarios div button{
        width:100%;
        margin-bottom:1em;

      }
      
    }

</style>