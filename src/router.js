import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes de vista
import Actividades from '/src/views/Actividades.vue';
import CambiarEstado from '/src/views/CambiarEstado.vue';
import Clientes from '/src/views/Clientes.vue';
import Cotizaciones from '/src/views/Cotizaciones.vue';
import Home from '/src/views/Home.vue';
import Indicadores from '/src/views/Indicadores.vue';
import InOut from '/src/views/InOut.vue';
import InstrumentosCalibrados from '/src/views/InstrumentosCalibrados.vue';
import InstrumentosClientes from '/src/views/InstrumentosClientes.vue';
import Nomenclador from '/src/views/Nomenclador.vue';
import NuevaOrden from '/src/views/NuevaOrden.vue';
import Ordenes from '/src/views/Ordenes.vue';
import Patrones from '/src/views/Patrones.vue';
import Perfiles from '/src/views/Perfiles.vue';
import Proveedores from '/src/views/Proveedores.vue';
import Usuarios from '/src/views/Usuarios.vue';



const routes = [
    { path: '/', component: Home },
  { path: '/InOut', component: InOut },
  { path: '/NuevaOrden', component: NuevaOrden },
  { path: '/CambiarEstado', component: CambiarEstado },
  { path: '/Nomenclador', component: Nomenclador },
  { path: '/InstrumentosCalibrados', component: InstrumentosCalibrados },
  { path: '/InstrumentosClientes', component: InstrumentosClientes },
  { path: '/Perfiles', component: Perfiles },
  { path: '/Usuarios', component: Usuarios },
  { path: '/Actividades', component: Actividades },
  { path: '/Indicadores', component: Indicadores },
  { path: '/Ordenes', component: Ordenes },
  { path: '/Clientes', component: Clientes },
  { path: '/Patrones', component: Patrones },
  { path: '/Cotizaciones', component: Cotizaciones },
  { path: '/Proveedores', component: Proveedores }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
