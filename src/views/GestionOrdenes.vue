<script setup>

import Title from '/src/components/TitleMain.vue';
//<Title text="Gestión de órdenes" />
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import apivue from "@/api/apivue";

const ordenes = ref([]);
const hoy = ref(
  new Date().toISOString().substr(0, 10)
)
onMounted(async () => {
  try {
    const { data } = await apivue.getGestionOrdenes();
    ordenes.value = data;
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
</script>

<template>
  <Title text="Gestión de órdenes" />
  <div class="mt-4 mx-auto --sm w-90 overflow-auto d-flex">
    <div class="row d-flex flex-nowrap">
      <div v-for="estado in estados" :key="estado.id" class="col-md-3 ">
        <div class="card shadow">
          <div class="card-header text-center"><span :class="`--text-color-estado-${estado.id}`">▋</span> {{ estado.nombre }}</div>
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
                    <div class="avatar">
                      <i v-if= "!element.id_usuario_asignado" class="fa-regular fa-user"></i>
                      <span v-else>{{ element.id_usuario_asignado }}</span>
                    </div>
                  </div>
                  <ul>
                    <li class="nombre-cliente">
                      
                      <i class="fa-solid fa-users mr-3"> </i>
                      {{ element.cliente_orden }}
                    </li>
                    <li>
                      <i class="fa-regular fa-clock" ></i>
                      6 días
                    </li>
                    <li> 
                      <i class="fa-regular fa-hard-drive"> </i>
                      <!-- {{ element.id_instrumento_cliente }} -->
                      Fluke 8508A
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
}

</style>