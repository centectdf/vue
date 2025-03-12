<template>
    <header>
        <a href="/" class="logo" aria-label="Ir al inicio">
            <img src="/src/assets/Logo-color-para-fondo-oscuro2.png" alt="Inicio - Centec" />
        </a>
        <nav class="nav">
            <i class="fa-solid fa-bars menu-icon" @click="toggleMenu" > </i>
            <ul id="navbar-links" :class="{'menu-visible': menuVisible}">
                
                <li><a><router-link to="/InOut">Ingresos / Egresos</router-link></a></li>
                <li><a><router-link to="/NuevaOrden">Nueva orden</router-link></a></li>
                <li><a><router-link to="/CambiarEstado">Cambiar estado</router-link></a></li>
                <li><a><router-link to="/Cotizaciones">Cotizaciones</router-link></a></li>
                <!-- a continuación, una linea horizontal negra antes del template:-->
                 

                 
                <template class="responsive-navbar">
                  <hr style="border: 1px solid var(--color-4); width: 100%;padding:0;margin:0">

                    <li><a><router-link to="/Usuarios">Usuarios</router-link></a></li>
                    <li><a><router-link to="/Perfiles">Perfiles</router-link></a></li>
                    <li><a><router-link to="/Clientes">Clientes</router-link></a></li>
                    <li><a><router-link to="/Patrones">Patrones</router-link></a></li> 
                    <li><a><router-link to="/InstrumentosClientes">Instrumentos clientes</router-link></a></li>
                    <li><a><router-link to="/Proveedores">Ordenes</router-link></a></li>
                    <li><a><router-link to="/InstrumentosCalibrados">Instrumentos calibrados</router-link></a></li>
                    <li><a><router-link to="/Nomenclador">Nomenclador</router-link></a></li>
                    <li><a><router-link to="/Proveedores">Actividades</router-link></a></li>
                    <li><a><router-link to="/Proveedores">Indicadores</router-link></a></li>
                </template>
            </ul>
        </nav>
    </header>
  </template>
  
  <style scoped>
  header {
    background-color: var(--color-5);
    color: var(--color-1);
    padding: 0;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: space-between; 
    position:relative;

  }

.logo {
  display: flex;
  text-decoration: none;
  height: 100%;
  align-items: center;
}

.logo img {
  height: 100%;
  width: auto;
  padding: 0;
  margin-left: 100px;
  transition:margin-left 0.5s ease;
}


.responsive-navbar{
  display:none;
  z-index:100;
}

.nav ul {
  display: flex;
  /*gap: 20px;  /* Espacio entre los enlaces */
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-right:5vw;
}

.nav a {
  color: var(--color-1);
  text-decoration: none;
  font-size: 1rem;
  padding: 5px 10px;
}

.nav a:hover {
  font-weight: default;
  color: var(--color-9);
  
}

/* Agregar el ícono del menú */
.menu-icon {
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 50px;
  color:var(--color-1);
  z-index:10;
}

.menu-icon:hover{
  color:var(--color-3);
}

/* Estilo para pantallas pequeñas */
@media (max-width: 930px) {

  .nav ul {
    display: none;  /* Ocultar los elementos del menú */
    flex-direction: column;  /* Alinearlos verticalmente */
    width: 100%;
    text-align: left;
    position:absolute;
    top:100%;
    left:0;
    background-color: var(--color-2);
    /*border:solid green 1px;*/
    width:100vw;
    flex-wrap:nowrap;
    padding:1em;
    padding-bottom:2em;
  }
  .responsive-navbar{
    display:block;
  }

  .menu-icon {
    display: block;  /* Mostrar el ícono de hamburguesa */
  }

  .menu-visible {
    display: flex !important;  /* Mostrar el menú cuando se active */
  }

  .nav li {
    padding: 0;
    width:100%;
    margin:0;
    padding-top:0.5em;
    padding-bottom:0.5em;
    /*border-top: 1px solid var(--color-1);*/  /* Separar las opciones */
    /*border:solid red 1px;*/
  }
  .nav a{
    padding:0;
    margin:0;
    width:100%;
    padding-left:1em;
    color:var(--color-5);
    
  }
  .logo img{
    margin-left:30px;
  }
}

  </style>
  

  <script setup>
  import {ref} from 'vue';
  import {onMounted} from 'vue';
  import {useRouter} from 'vue-router';

  const menuVisible = ref(false);
  function toggleMenu(){
    menuVisible.value = !menuVisible.value;
  }

  const router = useRouter();
  onMounted(() => {
    router.afterEach(() => {
      menuVisible.value = false;
    });
  });

  

</script>
