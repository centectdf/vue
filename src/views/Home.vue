<template>
  <Title text="Página principal" />
  <div class="container h-80 d-flex flex-column gap-4">
    <div class="row h-40 justify-content-center">

      <div class="card col-4 me-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Órdenes ingresadas</h5>
        <div class="card-body overflow-auto overflow-x-hidden">
          <table class="table w-100">
            <thead class="--tiny w-100 position-sticky">
              <tr>
                <th  class="ps-1">Cliente</th>
                <th  class="">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientes" :key="cliente.Cliente" class="">
                <td class="--tiny m-0 p-0 ps-1 cursor-pointer --hover-bold --txt-ellipsis">{{ cliente.Cliente }}</td>
                <td class="--tiny m-0 p-0">{{ cliente.Cantidad_de_instrumentos_ingresados }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card col-4 me-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Disponibles para retirar</h5>
        <div class="card-body overflow-auto  overflow-x-hidden">
          <table class="table w-100 ">
            <thead class="--bg-color-5 --tiny w-100 position-sticky">
              <tr>
                <th  class="ps-1">Cliente</th>
                <th  class=""></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cliente in clientesNotificar" :key="cliente.cliente" class="--bg-color-1 ">
                <td class="--tiny m-0 p-0 ps-1 cursor-pointer --hover-bold --txt-ellipsis">{{ cliente.cliente }}</td>
                <td class="--tiny m-0 p-0"><button class="--tiny p-1 m-1 btn-minimal"><i class="fa-solid fa-envelope mx-2"></i>Notificar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card col-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Datos</h5>
        <div class="card-body overflow-hidden">
          <div class="tinystats w-100 h-100">
              <div id="stat1" class="flex flex-column stat">
                <div><strong>Ingresados<br></strong>(+7 días)</div>
                <div><h4><strong>{{ ingresados_vencidos }}</strong></h4></div>
              </div>
              <div id="stat2" class="flex flex-column stat">
                <div><strong>Ingresados<br></strong>(total)</div>
                <div><h4><strong>{{ ingresados }}</strong></h4></div>
              </div>
              <div id="stat3" class="flex flex-column stat" >
                <div><h4><strong>{{ sincert }}</strong></h4></div>
                <div><strong>Sin certificado</strong></div>
              </div>
              <div id="stat4" class="flex flex-column stat">
                <div><h4><strong>{{ encentec }}</strong></h4></div>
                <div><strong>En CENTEC</strong></div>
              </div>
          </div>
        </div>
      </div>

    </div>
    <div class="row h-60 gap-4 justify-content-center ">
      <div class="col-4 d-flex flex-column justify-content-center mb-5">
        <div class="w-80 col-3 d-flex justify-content-left my-2 mx-5">
          <a href="#"
            class="btn btn-secondary --forbidden"
            id="btn-in">
              <i class="fa fa-sign-in me-2" aria-hidden="true"></i>
              Ingresar instrumentos
          </a>
        </div>
        <div class="w-80 col-3 d-flex justify-content-left my-2 mx-5">
          <a href="#"
            class="btn btn-secondary --forbidden"
            id="btn-out">
              <i class="fa fa-sign-out me-2" aria-hidden="true"></i>
              Entregar instrumentos
          </a>
        </div>
        <div class="w-80 col-3 d-flex justify-content-left my-2 mx-5">
          <a href="#"
            class="btn btn-primary ml-2 --forbidden"
            id="btn-ordenes">
              <i class="fa-solid fa-barcode me-2"></i>
              Ordenes
          </a>
        </div>
        <div class="w-80 col-3 d-flex justify-content-left my-2 mx-5">
          <a href="/GestionOrdenes"
            class="btn --btn-nuevo ml-2"
            id="btn-ordenes">
            <i class="fa-solid fa-table-cells-large me-2"></i>
              Gestión de órdenes
          </a>
        </div>

        <span
          class="status"
        
        >
          Base de datos del cliente:
          <span @click="mostrarDetalles = !mostrarDetalles" class="db-status"
          :class="{ actualizado: estadoDB, desactualizado: !estadoDB }">
            {{ estadoDB ? "✔️ Actualizada" : "❌ Desactualizada" }}
          </span>
        </span>
        <!-- Tooltip con detalles -->
        <div v-if="mostrarDetalles" class="tooltip-db">
          <p v-for="(detalle, key) in resultados" :key="key">
            {{ formatearTexto(key, detalle) }}
          </p>
        </div>

      </div>
      
      <div class="card col-4 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Estados de servicios</h5>
        <div class="card-body overflow-hidden">
          <div class="tinystats w-100 h-100 d-flex justify-content-center">
            <RadarChart
              :ingresados="ingresados"
              :enproceso="enproceso"
              :calib_finalizada="calib_finalizada"
              :cert_emitido="cert_emitido"
              :cert_aprobado="cert_aprobado"
              :enespera="enespera"
            />
          </div>
        </div>
      </div>
      <div class="card col-3 h-100">
        <h5 class="card-header --sm --bg-color-0 --text-bold">Condiciones ambientales</h5>
        <div class="card-body overflow-hidden">
          <div class="tinystats w-100 h-100 d-flex justify-content-center align-items-center flex-column">
            <div class="ambiente-cont" v-if="temperatura">
              <div class="titulo-ambiente">Temperatura:</div>
              <div class="ambiente">{{temperatura}} °C</div>
            </div>
            <div class="ambiente-cont" v-if="humedad">
              <div class="titulo-ambiente" >Humedad relativa:</div>
              <div class="ambiente"> {{humedad}} %RH</div>
            </div>
            <div class="ambiente-cont" v-if="!humedad && !temperatura">
              <div class="error-ambiente">Instrumento sin conexión</div>
            </div>        
          </div>
        </div>
      </div>
    </div>
  </div>
  

</template>

<script setup>
import Title from '/src/components/TitleMain.vue';
import api from "/src/api/api";
import apivue from "/src/api/apivue";
import {onMounted, ref} from 'vue'
import RadarChart from "/src/components/RadarChart.vue";
import {usePuntoEnComa} from "/src/composables/usePuntoEnComa";


const { puntoComa } = usePuntoEnComa();
const clientes = ref([]);
const clientesNotificar = ref([]);
const encentec = ref(null);
const enproceso = ref(null);
const ingresados = ref(null);
const ingresados_vencidos = ref(null);
const sincert = ref(null);
const calib_finalizada = ref(null);
const cert_emitido = ref(null);
const cert_aprobado = ref(null);
const enespera = ref(null);
const temperatura = ref(null);
const humedad = ref(null);
const resultados = ref({});
const estadoDB = ref(false);
const mostrarDetalles = ref(false);

const formatearTexto = (key, detalle) => {
  switch (key) {
    case "ordenes":
      return `Cantidad de ordenes: ${detalle.remoto} / ${detalle.local} ${detalle.pass ? "✔️" : "❌"}`;
    case "clientes_users":
      return `Usuarios asociados a clientes: ${detalle.remoto} / ${detalle.local} ${detalle.pass ? "✔️" : "❌"}`;
    case "cambios_estados_ordenes":
      return `Cambios de estado: ${detalle.remoto} / ${detalle.local} ${detalle.pass ? "✔️" : "❌"}`;
    case "instrumentos_clientes":
      return `Cantidad de instrumentos: ${detalle.remoto} / ${detalle.local} ${detalle.pass ? "✔️" : "❌"}`;
    case "ultimos_10_ordenes":
      return `Últimos 10 registros en tabla ordenes: ${detalle.pass ? "Coincidentes ✔️" : "Diferentes ❌"}`;
    default:
      return "";
  }
};


onMounted(async () => {
  document.addEventListener("click", (event) => {    
    // Verificamos si el clic no fue ni en el "db-status" ni dentro del "tooltip"
    if (!event.target.closest(".db-status") && !event.target.closest(".tooltip")) {
      mostrarDetalles.value = false;
    }
  });

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
    if (dataCantidades.length > 0) {
      encentec.value = dataCantidades[0].encentec;
      enproceso.value = dataCantidades[0].enproceso;
      ingresados.value = dataCantidades[0].ingresados;
      ingresados_vencidos.value = dataCantidades[0].ingresados_vencidos;
      sincert.value = dataCantidades[0].sincert;
      calib_finalizada.value = dataCantidades[0].calib_finalizada;
      cert_emitido.value = dataCantidades[0].cert_emitido;
      cert_aprobado.value = dataCantidades[0].cert_aprobado;
      enespera.value = dataCantidades[0].enespera;
    }

    const { data: datosAmbiente } = await api.getTemperaturaHumedad();
    temperatura.value = puntoComa(datosAmbiente.temperatura);
    humedad.value = puntoComa(datosAmbiente.humedad);

    const response = await apivue.getDBCheck();
    resultados.value = response.data;
    estadoDB.value = Object.values(resultados.value).every((item) => item.pass);

    const actualizarDatos = async () => {
      try {
        const { data: datosAmbiente } = await api.getTemperaturaHumedad();
        temperatura.value = puntoComa(datosAmbiente.temperatura);
        humedad.value = puntoComa(datosAmbiente.humedad);
      } catch (error) {
        temperatura.value = null;
        humedad.value = null;
      }
    };

    const checkDB = async () => {
      try {
        const response = await apivue.getDBCheck();
        resultados.value = response.data;
        estadoDB.value = Object.values(resultados.value).every((item) => item.pass);
      } catch (error) {
        console.error("Error al obtener ordenes:", error);
      }
    };

    

   setInterval(actualizarDatos, 3000);
   setInterval(checkDB, 300000);

    // Llamar a la función inmediatamente para obtener los datos al cargar la página
    await actualizarDatos();
    await checkDB();

  } catch (error) {
    console.error("Error al obtener ordenes:", error);
  }
});


const nodisponible = () => {
  alert('Funcionalidad no disponible')
}

</script>

<style scoped>
#btn-in, #btn-out{transition:font-size 0.5s;}
#btn-ordenes{transition:all 0.5s;}
table td{padding:0.25em 0 0.25em 1em !important;}
table th:last-of-type, table td:last-of-type{padding:0 !important;padding-right:0.5em !important;}
tbody{overflow-y:scroll !important;}

.tinystats{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
}
#stat1{border-right:solid 1px var(--color-7);border-bottom:solid 1px var(--color-7);}
#stat2{border-left:solid 1px var(--color-7);border-bottom:solid 1px var(--color-7)}
#stat3{border-right:solid 1px var(--color-7);border-top:solid 1px var(--color-7)}
#stat4{border-left:solid 1px var(--color-7);border-top:solid 1px var(--color-7)}

#stat1 div:first-of-type,
#stat2 div:first-of-type,
#stat3 div:last-of-type,
#stat4 div:last-of-type{
  color:var(--color-4);
  font-size:0.8em;
  font-weight: bold;
  text-align:center;
}
#stat1 div:last-of-type,
#stat2 div:last-of-type,
#stat3 div:first-of-type,
#stat4 div:first-of-type{
  height:4em;
  display:flex;
  align-items:center;
  justify-content:center;
}

.ambiente{
  font-size:20px;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-style: normal;

}

.titulo-ambiente{
  font-size:14px;
  color:var(--color-5);
  margin-bottom:0.5em;
}

.ambiente-cont{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  box-shadow:1px 1px 2px 2px var(--color-2);
  border-radius:10px;
  padding:1em;
  margin-bottom:1em;
}

.db-status {cursor: pointer;margin-left:0.5em;}
.db-status:hover {font-weight:bold;}
.actualizado {color: green;}
.desactualizado {color: red;}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  margin-left:3em;
  margin-top:1em;
  font-size:14px;
}

.tooltip-db {
  position: absolute;
  z-index: 10;
  bottom: 50px;
  left: 20vw;
  background: var(--color-26);
  color:var(--color-1);
  border: none;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 1.5em;
  padding-bottom:1em;
  font-size:12px;
  display:flex;
  flex-direction:column;
  
}



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
