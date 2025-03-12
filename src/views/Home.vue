<template>
  <Title text="Página principal" />
  <div class="container h-80 d-flex flex-column">
    <div class="row h-40 justify-content-center">

      <div class="card col-4 me-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Órdenes ingresadas</h5>
        <div class="card-body overflow-auto overflow-x-hidden">
          <table class="w-100">
            <thead class="--bg-color-5 --tiny w-100 --sticky">
              <tr>
                <th  class="--text-color-1 --pl-1">Cliente</th>
                <th  class="--text-color-1">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientes" :key="cliente.Cliente" class="--bg-color-1">
                <td class="--tiny --m-0 --p-0 --pl-1 --cursor-pointer --hover-bold --txt-ellipsis">{{ cliente.Cliente }}</td>
                <td class="--tiny --m-0 --p-0">{{ cliente.Cantidad_de_instrumentos_ingresados }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card col-4 me-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Disponibles para retirar</h5>
        <div class="card-body overflow-auto  overflow-x-hidden">
          <table class="w-100 ">
            <thead class="--bg-color-5 --tiny w-100 --sticky">
              <tr>
                <th  class="--text-color-1 --pl-1">Cliente</th>
                <th  class="--text-color-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientesNotificar" :key="cliente.cliente" class="--bg-color-1 ">
                <td class="--tiny --m-0 --p-0 --pl-1 --cursor-pointer --hover-bold --txt-ellipsis">{{ cliente.cliente }}</td>
                <td class="--tiny --m-0 --p-0"><button class="--tiny p-1 m-1 btn-dark">Notificar</button></td>
              </tr>
            </tbody>
          </table>




          
        </div>
      </div>
      <div class="card col-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Datos</h5>
        <div class="card-body overflow-hidden">
          <div class="tinystats w-100 h-100">

              <div id="stat1">{{ cantidades.ingresados }}</div>
              <div id="stat2"></div>
              <div id="stat3"></div>
              <div id="stat4"></div>






          </div>


        </div>
        
      </div>

    </div>
    <div class="row h-20 justify-content-center">

      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-secondary" id="btn-in"><i class="fa fa-sign-in me-2" aria-hidden="true"></i>Ingresar instrumentos</a>
      </div>
      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-secondary" id="btn-out"><i class="fa fa-sign-out me-2" aria-hidden="true"></i>Entregar instrumentos</a>
      </div>

      <div class="col-3 d-flex justify-content-center my-5">
        <a href="#" class="btn btn-primary ml-2" id="btn-ordenes"><i class="fa-solid fa-barcode me-2"></i>Ordenes</a>
      </div>

    </div>

    <div class="row h-40 ">
      <div class="card text-center">
        <div class="card-header">
           
        </div>
        <div class="card-body">
          <h5 class="card-title">Verificaciones y calibraciones</h5>
          <p class="card-text">Registro y seguimiento de todos los servicios de calibración y verificación de instrumentos de CENTEC-TDF.</p>
          <button class="btn btn-secondary" @click="nodisponible">Ingresar</button>

        </div>
        <div class="card-footer text-muted">
           
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Title from '/src/components/TitleMain.vue';
import api from "/src/api/api";
import {onMounted, ref} from 'vue'

const clientes = ref([]);
const clientesNotificar = ref([]);
const cantidades = ref([]);



onMounted(async () => {
  try {
    const { data: clientesData } = await api.getIngresadosPorCliente();
    clientes.value = clientesData.map(cliente => ({
      ...cliente
    }));


    const { data: clientesNotificarData } = await api.getClientesANotificar(); 
    clientesNotificar.value = clientesNotificarData.map(clienteNotificar => ({
      ...clienteNotificar
    }));


    const { data: dataCantidades } = await api.getTinyStats(); 
// traer stats!!
    cantidades.value = dataCantidades.map(cantidad => ({
      ...cantidad
    }));
    console.log(cantidades)









  } catch (error) {
    console.error("Error al obtener ordenes:", error);
  }
});


const nodisponible = () => {
  alert('Funcionalidad no disponible')
}

</script>

<style scoped>
#btn-in, #btn-out{
  transition:font-size 0.5s;
}
#btn-ordenes{
  transition:all 0.5s;
}

.--sticky{position:sticky;top:-1.3em;}


table td{
  padding:0.25em 0 0.25em 1em !important;
}
table th:last-of-type, table td:last-of-type{
  padding:0 !important;
  padding-right:0.5em !important;
}
tbody{
  overflow-y:scroll !important;
}

.tinystats{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
}
#stat1{border-right:solid 1px var(--color-7);border-bottom:solid 1px var(--color-7)}
#stat2{border-left:solid 1px var(--color-7);border-bottom:solid 1px var(--color-7)}
#stat3{border-right:solid 1px var(--color-7);border-top:solid 1px var(--color-7)}
#stat4{border-left:solid 1px var(--color-7);border-top:solid 1px var(--color-7)}

@media screen and (max-width: 1200px) {
#btn-in, #btn-out, #btn-ordenes{
  text-align:center;
  font-size:0.8em;
  height:80%;
}
#btn-ordenes{
  text-justify:center;

  align-self:center;
}
  
}

@media screen and (max-width: 990px) {
  #btn-in, #btn-out{
    height:100%;
  }
  #btn-ordenes{
    height:65%;
}

}

</style>
