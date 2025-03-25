<script setup>
import Title from '/src/components/TitleMain.vue';
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import apivue from "@/api/apivue";
import { useUsuarioStore } from "/src/stores/usuario.js";
const loaded = ref(false);
const usuarioStore = useUsuarioStore();
const usuario = computed(() => usuarioStore.usuario);
const ordenes = ref([]);
const clientesActivos = ref([]);
const usuarioFiltrado = ref("");
const idClienteFiltrado = ref("");
const textoFiltrado = ref("");
const ultimoCambio = ref("");

const motivo = ref("");
const pedirMotivo = ref(false);
const ordenElegida = ref("")
const estadoElegido = ref("")
const ordenOrigen = ref("")
const idEstadoElegido = ref("")

let estadoOrigen = ref("");
let estadoDestino = ref("");
const hoy = ref(
  new Date().toISOString().substr(0, 10)
)

const updateAll = async() => {
  loaded.value = false;
  ordenes.value = [];
  try {
    const { data } = await apivue.getGestionOrdenes();
    ordenes.value = data;
    //console.log(ordenes)
    loaded.value = true;
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
  }

  try {
    const {data: clientes} = await apivue.getClientesActivos();
    clientesActivos.value = clientes;
  } catch (error) {
    console.error("Error al obtener clientes activos:", error);
  }
};

onMounted(async () => {  
  try {
    const { data } = await apivue.getGestionOrdenes();
    ordenes.value = data;
    //console.log(ordenes)
    loaded.value = true;
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
  { id: "5", nombre: "Cert. aprobado" },
  { id: "10", nombre: "Cancelado" }
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

// const ordenesFiltradas = () => {
//   return ordenesFiltradasPorUsuario().filter(o => !idClienteFiltrado.value || o.id_cliente_orden === idClienteFiltrado.value);
// };
const ordenesFiltradas = () => {
  return ordenesFiltradasPorUsuario().filter(o => 
    (!idClienteFiltrado.value || o.id_cliente_orden === idClienteFiltrado.value) &&
    (!textoFiltrado.value || JSON.stringify(o).toLowerCase().includes(textoFiltrado.value.toLowerCase()))
  );
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

const aceptarCambio = () => {
  if (motivo.value){
    ordenes.value.find(o => o.orden === ordenElegida.value).id_secuencia = idEstadoElegido.value;
    //console.log(motivo.value)
    //actualizarEstadoOrden(ordenElegida.value, idEstadoElegido.value, usuario.value.id, motivo.value)
    actualizarEstadoOrden()
    if (idEstadoElegido.value == "10"){
      ordenes.value = ordenes.value.filter(o => o.orden !== ordenElegida.value);
    }
    pedirMotivo.value = false;
    motivo.value = "";
  } else {
    alert("Debe ingresar un motivo")
  }
  
  
}

const cancelarCambio = () => {
  ordenes.value.find(o => o.orden === ordenElegida.value).id_secuencia = ordenOrigen.value;
  pedirMotivo.value = false;
  motivo.value = "";
}

const moverOrden = (event, nuevoEstado) => {
  
  if (event.added){
    //Acá están los datos de destino
    estadoDestino.value = nuevoEstado;
    
  }
  if (event.removed){
    //Acá están los datos de origen
    const ordenMovida = event.removed.element.orden;
    ordenElegida.value = ordenMovida;
    idEstadoElegido.value = estadoDestino.value

    estadoOrigen.value = nuevoEstado;
    //console.log("origen: ", estadoOrigen.value)
    //console.log("destino: ", estadoDestino.value)
    if(estadoDestino.value=='10'){
      ordenElegida.value = ordenMovida;
      idEstadoElegido.value = '10'
      estadoElegido.value = "CANCELADO"
      ordenOrigen.value = estadoOrigen;
      pedirMotivo.value = true;

    } else {
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
            //console.log(motivo.value)
            //actualizarEstadoOrden(ordenMovida, estadoDestino.value, usuario.value.id, motivo.value)
            actualizarEstadoOrden()
          }
          else {
            ordenes.value.find(o => o.orden === ordenMovida).id_secuencia = estadoOrigen;
          }
        }
      } else {
        //console.log("para atrás")
      //console.log("origen: ", estadoOrigen.value)
      //console.log("destino: ", estadoDestino.value)
        ordenElegida.value = ordenMovida;
        idEstadoElegido.value = estadoDestino.value
        switch(estadoDestino.value){
          case '1':
            estadoElegido.value = "INGRESADO"
            break;
          case '2':
            estadoElegido.value = "EN PROCESO"
            break;
          case '3':
            estadoElegido.value = "CALIB. FINALIZADA"
            break;
          case '4':
            estadoElegido.value = "CERT. EMITIDO"
            break;
        }
        ordenOrigen.value = estadoOrigen;
        pedirMotivo.value = true;
        
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
const actualizarEstadoOrden = async () => {
  try {
    const response = await apivue.updateEstadoOrden(
      ordenElegida.value,
      idEstadoElegido.value,
      usuario.value.id,
      motivo.value
    );
    console.log(response.data)
    getUltimoCambio();
    alert(response.data.message);
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
  }
};

const getUltimoCambio = async () => {
  try {
    const response = await apivue.getUltimoCambio();
    ultimoCambio.value = response.data;
    //console.log("Ultimo cambio:", ultimoCambio.value.id);
    actualizarEstado(ultimoCambio.value.id);
  } catch (error) {
    console.error("Error al obtener el último cambio:", error);
  }
};

const actualizarEstado = async (id_cambio) => {
  try {
    const response = await apivue.updateEstado(ordenElegida.value, id_cambio);
    //console.log(response.data);
    //console.log("Estado de orden n° ", ordenElegida.value, " actualizado");
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
  }
}



</script>

<template>
  <div class="estadoKanban" id="estadoKanban-update" v-if="loaded" @click="updateAll"><i class="fa-solid fa-rotate"></i></div>
  <div class="estadoKanban spinner" v-if="!loaded"><i class="fa-solid fa-spinner"></i></div>
  <Title text="Gestión de órdenes" />
  <div class="filtros-kanban w-100 d-flex justify-content-around">
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
    <div class="filtro-texto d-flex --sm">
      <label>Buscar: </label>
      <input type="text" class="px-2 mx-3" v-model="textoFiltrado">
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
  <div class="mt-4 mx-auto --sm w-95 overflow-auto d-flex h-65">
    <div class="row d-flex flex-nowrap">
      <div v-for="estado in estados" :key="estado.id" class="columna">
        <div :class="{'shadow card': estado.id!=10}" class="">
          <div v-if="estado.id != 10" class="card-header text-center">
            <span :class="`--text-color-estado-${estado.id}`">▋</span> {{ estado.nombre }}
          </div>
          <div v-if="estado.id == 10" class="card-header trash">🗑</div>

          <div class="card-body" style="min-height: 200px;">
            <draggable 
              v-model="ordenesPorEstado(estado.id).value"
              group="ordenes" 
              @change="event => moverOrden(event, estado.id)"
              class="list-group">
              <template #item="{ element }">
                <div class="list-group-item">
                  <div class="d-flex direction-row justify-content-between titulo-orden">
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
                    <!-- <div class="cancelar-orden">✖</div> -->
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
                          <li v-for="inst in element.instrumentos" class="seccion-instrumento">
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
      <div class="popup-motivo shadow" v-if="pedirMotivo">
        <div class="d-flex align-items-end gap-2 my-4"><h4><strong>Cambio de estado | </strong>Orden <span>{{ ordenElegida }}</span></h4></div>
        <div class="mt-1 mb-3">Cambio a "<strong>{{ estadoElegido }}</strong>"</div>
        <div class="d-flex gap-3 mb-4"><label for="motivo">Motivo: </label>
        <textarea class="motivo-textarea" v-model="motivo" @keydown.enter.prevent="aceptarCambio"></textarea></div>
        <div class="d-flex justify-content-end mb-5">
          <button class="mx-4 btn btn-secondary" @click="cancelarCambio">Cancelar</button>
          <button class="btn btn-primary" @click="aceptarCambio">Continuar ↵</button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style>
.estadoKanban{
  position:fixed;
  top:120px;
  right:480px;
  z-index:1000;
  font-size:20px;
  transition:all 0.3s;
}

@media screen and (max-width: 1100px) {.estadoKanban{right:440px;top:115px;}}
@media screen and (max-width: 860px) {.estadoKanban{right:400px;top:110px;}}
@media screen and (max-width: 540px) {.estadoKanban{right:350px;top:100px;}}

#estadoKanban-update{
  cursor:pointer;
}
#estadoKanban-update:hover{
  color:var(--color-8);
}

.popup-motivo{
  position:fixed;
  min-height:250px;
  width:30vw;
  min-width:500px;
  top:15vh;
  right:35vw;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background-color:var(--color-1);
  border:1px solid var(--color-3);
  border-radius:5px;
  padding:3em;
  z-index:100;
  font-size:0.9em;

}
.motivo-textarea{
  width:300px;
  padding:1em;

}
.columna{
  width:350px;
  max-width:350px;
}
.columna:last-of-type{
  background-color:none;
  height:13vh;
  overflow:hidden;
  position:fixed;
  bottom:3vh;
  left:5vw;
  width:95vw !important;
  min-width:95vw !important;
  max-width:95vw !important;
  text-align:center;
  text-justify:center;
}
.trash{
  font-size:100px;
  height:0.1px;
  overflow:visible;
  color:var(--color-4);
  cursor:default;

}
.trash:hover{color:red}
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
  max-width:350px;
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
.seccion-instrumento{
  display:flex;
  flex-wrap:nowrap;
  overflow:hidden;
  text-wrap:nowrap;
  max-width:95%;
}
.instrumento-enorden{
  margin-left:0.5em;
  max-width:100%;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.cliente-orden, .tiempo-orden{
  margin-left:0.5em;
  max-width:200px;
}
.titulo-orden{
  position:relative;
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
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.avatar:hover{
  background-color:var(--color-4) !important;
  color:var(--color-0) !important;
}
.cancelar-orden{
  position:absolute;
  top:2.5em;
  right:0;
  border-radius:50%;
  line-height:2em;
  height:2em;
  width:2em;
  background-color:inherit;
  color:red;
  border:none;
  cursor:pointer;
  text-align:center;
}
.cancelar-orden:hover{
  background-color:red;
  color:var(--color-0);
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
.filtro-texto input{
  border:none;
  background-color:inherit;
  border-bottom:solid 2px var(--color-8);
  color:var(--color-5);
  transition:all 0.3s;
}
.filtro-texto input:hover{
  border-bottom:solid 3px var(--color-8);
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