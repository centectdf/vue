<script setup>
import Title from '/src/components/TitleMain.vue';
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import apivue from "@/api/apivue";
import { useUsuarioStore } from "/src/stores/usuario.js";

const usuarioStore = useUsuarioStore();
const usuario = computed(() => usuarioStore.usuario);
const ordenes = ref([]);
const clientesActivos = ref([]);
const usuarioFiltrado = ref("");
const idClienteFiltrado = ref("");
const ultimoCambio = ref("");
let estadoOrigen = ref("");
let estadoDestino = ref("");
const hoy = ref(
  new Date().toISOString().substr(0, 10)
)
onMounted(async () => {
  
  try {
    const { data } = await apivue.getGestionOrdenes();
    ordenes.value = data;
    //console.log(ordenes)
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
  }

  try {
    const {data: clientes} = await apivue.getClientesActivos();
    clientesActivos.value = clientes;
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
  }
});

const estados = ref([
  { id: "0", nombre: "En Espera" },
  { id: "1", nombre: "Ingresados" },
  { id: "2", nombre: "En proceso" },
  { id: "3", nombre: "Calib. finalizada" },
  { id: "4", nombre: "Cert. emitido" },
  { id: "5", nombre: "Cert. aprobado" }
]);

const diasTranscurridos = (fecha) => {
  const fechaIngreso = new Date(fecha);
  const fechaActual = new Date(hoy.value);
  const diferencia = fechaActual.getTime() - fechaIngreso.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};

const ordenesFiltradasPorUsuario = () => {
  return ordenes.value.filter(o => !usuarioFiltrado.value || o.id_usuario_asignado === usuarioFiltrado.value);
};

const ordenesFiltradas = () => {
  return ordenesFiltradasPorUsuario().filter(o => !idClienteFiltrado.value || o.id_cliente_orden === idClienteFiltrado.value);
};

const ordenesPorEstado = (idSecuencia) => {
  return computed({
    get: () => ordenesFiltradas().filter(o => o.id_secuencia === idSecuencia),
    set: (newList) => {
      newList.forEach(orden => {
        const index = ordenes.value.findIndex(o => o.orden === orden.orden);
        if (index !== -1) {
          ordenes.value[index].id_secuencia = idSecuencia;
        }
      });
    }
  });
};

const moverOrden = (event, nuevoEstado) => {
  
  if (event.added){
    //Acá están los datos de destino
    estadoDestino.value = nuevoEstado;
    
  }
  if (event.removed){
    //Acá están los datos de origen
    const ordenMovida = event.removed.element.orden;
    estadoOrigen.value = nuevoEstado;
    //console.log("origen: ", estadoOrigen.value)
    //console.log("destino: ", estadoDestino.value)
    if(estadoOrigen.value < estadoDestino.value){
      if( estadoDestino.value - estadoOrigen.value > 1 ){
        //console.log("no se puede para adelante + de 1 paso")
        alert("Movimiento no permitido");
        ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoOrigen;
        return
      } else {
        //console.log("para adelante 1 paso")
        const confirmar = confirm(`¿Desea mover la orden ${ordenMovida} de "${estados.value.find(e => e.id === estadoOrigen.value).nombre}" a "${estados.value.find(e => e.id === estadoDestino.value).nombre}"?`);
        if(confirmar){
          ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoDestino;
          console.log(ordenMovida, estadoDestino.value, usuario.value.id)
          actualizarEstadoOrden(ordenMovida, estadoDestino.value, usuario.value.id)

        }
        else {
          ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoOrigen;
        }

      }
      
    } else {
      //console.log("para atrás")

      const confirmar = confirm(`supongamos que ponemos motivo, ¿Desea mover la orden ${ordenMovida} de "${estados.value.find(e => e.id === estadoOrigen.value).nombre}" a "${estados.value.find(e => e.id === estadoDestino.value).nombre}"?`);
      if(confirmar){
          ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoDestino;
          actualizarEstadoOrden(ordenMovida, estadoDestino.value, usuario.value.id)
        }
        else {
          ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoOrigen;
        }
      





    }

  }
  
};

const getAvatarClass = (id_usuario_asignado) => {
    return {
      'clase-ao': id_usuario_asignado === '294',
      'clase-al': id_usuario_asignado === '115',
      'clase-fr': id_usuario_asignado === '7',
      'clase-ab': id_usuario_asignado === '111',
      'clase-mb': id_usuario_asignado === '233'
    };
  }

const actualizarUsuarioAsignado = async (orden, id_usuario_asignado) => {
  try {
    const response = await apivue.updateUsuarioAsignado(orden, id_usuario_asignado);
    alert(response.data.message);
  } catch (error) {
    console.error("Error al actualizar el usuario asignado:", error);
  }
};
const actualizarEstadoOrden = async (orden, id_estado, id_usuario) => {
  try {
    const response = await apivue.updateEstadoOrden(orden, id_estado, id_usuario);
    getUltimoCambio(orden);
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
  }
};

const getUltimoCambio = async (orden) => {
  try {
    const response = await apivue.getUltimoCambio();
    ultimoCambio.value = response.data;
    actualizarEstado(orden, ultimoCambio.value.id);
  } catch (error) {
    console.error("Error al obtener el último cambio:", error);
  }
};

const actualizarEstado = async (orden, id_cambio) => {
  try {
    const response = await apivue.updateEstado(orden, id_cambio);
    console.log("Estado de orden n° ", orden, " actualizado");
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
  }
}



</script>

<template>
  <Title text="Gestión de órdenes" />
  <div class="filtros-kanban w-100 border d-flex justify-content-around">
    <div class="filtro-usuario d-flex --sm">
      <label>Filtrar por usuario: </label>
      <select class="px-2 mx-3" v-model="usuarioFiltrado">
        <option value="">Todos</option>
        <option value="294">Agustina Ojeda</option>
        <option value="115">Andrés Larrahona</option>
        <option value="7">Fernando Rodríguez</option>
        <option value="111">Hiram Barquet</option>
        <option value="233">Matías Balbo</option>
      </select>
    </div>
    <div class="filtro-cliente d-flex --sm">
      <label>Filtrar por cliente: </label>
      <select class="px-2 mx-3" v-model="idClienteFiltrado">
        <option value="">Todos</option>
        <option v-for="cliente in clientesActivos"
          :key="cliente.id"
          :value="cliente.id_cliente">
          {{ cliente.cliente }}
        </option>
      </select>
    </div>
  </div>
  <div class="mt-4 mx-auto --sm w-90 overflow-auto d-flex">
    <div class="row d-flex flex-nowrap">
      <div v-for="estado in estados" :key="estado.id" class="col-md-3 ">
        <div class="card shadow">
          <div class="card-header text-center">
            <span :class="`--text-color-estado-${estado.id}`">▋</span> {{ estado.nombre }}
          </div>
          <div class="card-body" style="min-height: 200px;">
            <draggable 
              v-model="ordenesPorEstado(estado.id).value"
              group="ordenes" 
              @change="event => moverOrden(event, estado.id)"
              class="list-group">
              <template #item="{ element }">
                <div class="list-group-item">
                  <div class="d-flex direction-row justify-content-between">
                    <div><strong class="id-orden">{{ element.orden }}</strong></div>
                    <select
                      v-model="element.id_usuario_asignado"
                      class="avatar"
                      :class="getAvatarClass(element.id_usuario_asignado)"
                      @change="actualizarUsuarioAsignado(element.orden, element.id_usuario_asignado)"
                    >
                      <option value="0" selected>
                        ⏷
                      </option>
                      <option value="294">AO</option>
                      <option value="115">AL</option>
                      <option value="7">FR</option>
                      <option value="111">HB</option>
                      <option value="233">MB</option>
                    </select>
                  </div>
                  <ul>
                    <li class="nombre-cliente">
                      
                      <i class="fa-solid fa-users mr-3"> </i>
                      <span class="cliente-orden">{{ element.cliente_orden }}</span>
                    </li>
                    <li>
                      <i class="fa-regular fa-clock" ></i>
                      <span class="tiempo-orden"
                        :class="{'text-bold-danger': diasTranscurridos(element.fecha_ingreso) >= 15,
                        'text-danger': diasTranscurridos(element.fecha_ingreso) > 7
                        && diasTranscurridos(element.fecha_ingreso) < 15}"
                      >
                        {{ diasTranscurridos(element.fecha_ingreso) }} días
                      </span>
                    </li>
                    <li> 
                        <ul>
                          <li v-for="inst in element.instrumentos">
                            <i class="fa-regular fa-hard-drive"> </i>
                            <span class="instrumento-enorden">{{inst.tipo}} {{ inst.marca }} {{ inst.modelo }}</span>
                          </li>
                        </ul>
                    </li>
                  </ul>

                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<style>
.list-group-item {
  cursor: grab;
  background: var(--color-0);
  border: 1px solid var(--color-3);
  border-radius:5px;
  text-align:left;
  display:flex;
  flex-direction:column;
  padding-left:1em;
  margin:0.5em auto;
  width:95%;

}

.id-orden{
  font-size:16px;
  margin-bottom:0.5em;
  padding:0;
}
.list-group-item:hover {
  background: var(--color-2);
}
.list-group-item ul{
  list-style:none;
  padding:0;
  margin:0;
  font-size:12px !important;
}
.list-group-item ul li{
  padding:0.15em 0;
}

.nombre-cliente{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

}
.instrumento-enorden, .cliente-orden, .tiempo-orden{
  margin-left:0.5em;
  max-width:200px;
}
.avatar{
  font-size:12px;
  border-radius:50%;
  width:2em;
  height:2em;
  text-align:center;
  line-height:2em;
  border:none;
  font-weight:bold;
  background-color:var(--color-2);
  color:var(--color-5);
  cursor:pointer !important;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.avatar:hover{
  background-color:var(--color-4) !important;
  color:var(--color-0) !important;
}
.filtros-kanban select{
  border:none;
  color:var(--color-5);
  cursor:pointer !important;
  transition:all 0.2s;
}
.filtros-kanban select:hover{
  font-weight:bold !important;
  background-color:var(--color-2);
}
.clase-ao{
  background-color:var(--color-AO) !important;
  color:var(--color-0);
}
.clase-al{
  background-color:var(--color-AL) !important;
  color:var(--color-0);
}
.clase-fr{
  background-color:var(--color-FR) !important;
  color:var(--color-0);
}
.clase-ab{
  background-color:var(--color-AB) !important;
  color:var(--color-0);
}
.clase-mb{
  background-color:var(--color-MB) !important;
  color:var(--color-0);
}
select option{
  background-color:var(--color-2) !important;
  color:var(--color-5) !important;
}

</style>