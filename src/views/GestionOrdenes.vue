<script setup>
import Title from '/src/components/TitleMain.vue';
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import apivue from "@/api/apivue";
import { useUsuarioStore } from "/src/stores/usuario.js";

const usuarioStore = useUsuarioStore();
const usuario = computed(() => usuarioStore.usuario);
const ordenes = ref([]);
const hoy = ref(
  new Date().toISOString().substr(0, 10)
)
onMounted(async () => {
  console.log("ID usuario logueado: ", usuario.value.id)
  try {
    const { data } = await apivue.getGestionOrdenes();
    ordenes.value = data;
    //console.log(ordenes)
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
  }
});

const estados = ref([
  { id: "7", nombre: "En Espera" },
  { id: "1", nombre: "Ingresados" },
  { id: "2", nombre: "En proceso" },
  { id: "3", nombre: "Calib. finalizada" },
  { id: "4", nombre: "Cert. emitido" },
  { id: "8", nombre: "Cert. aprobado" }
]);

const diasTranscurridos = (fecha) => {
  const fechaIngreso = new Date(fecha);
  const fechaActual = new Date(hoy.value);
  const diferencia = fechaActual.getTime() - fechaIngreso.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};

const ordenesPorEstado = (idEstado) => {
  return computed({
    get: () => ordenes.value.filter(o => o.id_estado === idEstado),
    set: (newList) => {
      newList.forEach(orden => {
        const index = ordenes.value.findIndex(o => o.orden === orden.orden);
        if (index !== -1) {
          ordenes.value[index].id_estado = idEstado;
        }
      });
    }
  });
};

const moverOrden = (event, nuevoEstado) => {
  if (event.moved) {
    const orden = event.moved.element;
    const index = ordenes.value.findIndex(o => o.orden === orden.orden);
    const estadoAnterior = ordenes.value[index].id_estado;
    
    if (index !== -1) {
      ordenes.value[index].id_estado = nuevoEstado;
      console.log(`Orden #${orden.orden} movida de ${estadoAnterior} a ${nuevoEstado}`);
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
</script>

<template>
  <Title text="Gestión de órdenes" />
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
/* .modal-asigna{
  position:absolute;
  top:20vh;
  left:35vw;
  width:30vw;
  height:15vh;
  background-color:var(--color-1);
  border:solid 1px var(--color-3);
  border-radius:10px;
  display:flex;
  flex-direction:column;
  z-index:100;
} */
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