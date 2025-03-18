
<template>
  <header>
      <a href="/Home" class="logo" aria-label="Ir al inicio">
          <img src="/src/assets/Logo-color-para-fondo-oscuro2.png" alt="Inicio - Centec" />
      </a>
      <nav class="nav">
          <i class="fa-solid fa-bars menu-icon" @click="toggleMenu" v-if="usuarioStore.usuario"> </i>
          <div class="user-logo user-icon-hidden" @click="toggleUserMenu" v-if="usuarioStore.usuario"> {{ inicial }} </div>
          <ul id="navbar-links" :class="{'menu-visible': menuVisible}" v-if="usuarioStore.usuario">
              <li v-if="usuarioStore.usuario"><a ><router-link class="--forbidden" to="#">Ingresos / Egresos</router-link></a></li>
              <li v-if="usuarioStore.usuario"><a><router-link class="--forbidden" to="#">Nueva orden</router-link></a></li>
              <li v-if="usuarioStore.usuario"><a><router-link class="--forbidden" to="/#">Cambiar estado</router-link></a></li>
              <li v-if="usuarioStore.usuario"><a><router-link class="--forbidden" to="#">Cotizaciones</router-link></a></li>
              <li v-if="usuarioStore.usuario"><div class="user-logo user-icon-displayed" @click="toggleUserMenu">{{ inicial }}</div></li>
              <!-- a continuación, una linea horizontal negra antes del template:-->
               
               
              <template class="responsive-navbar">
                <hr style="border: 1px solid var(--color-4); width: 100%;padding:0;margin:0">

                  <li><a><router-link class="--forbidden" to="/">Usuarios</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Perfiles</router-link></a></li>
                  <li ><a><router-link class="--forbidden" to="/">Clientes</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Patrones</router-link></a></li> 
                  <li><a><router-link class="--forbidden" to="/">Instrumentos clientes</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Ordenes</router-link></a></li>
                  <li ><a><router-link class="--forbidden" to="/">Instrumentos calibrados</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Nomenclador</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Actividades</router-link></a></li>
                  <li><a><router-link class="--forbidden" to="/">Indicadores</router-link></a></li>
              </template>
          </ul>
          
      </nav>
      <ul class="user-menu" :class="{ 'menu-visible': userMenuVisible }" v-if="usuarioStore.usuario">
        <li>{{ usuarioStore.usuario.nombre }}</li>
        <li>Mi cuenta</li>
        <li>Descargar manual</li>
        <li @click="cerrarSesion">Cerrar sesión</li>
      </ul>
  </header>
</template>



<script setup>
import { ref, computed } from "vue";
import { useUsuarioStore } from "../stores/usuario.js";
import { useRouter } from "vue-router";

const usuarioStore = useUsuarioStore();
const router = useRouter();
const menuVisible = ref(false);
const userMenuVisible = ref(false);

const inicial = computed(() => usuarioStore.usuario ? usuarioStore.usuario.nombre[0].toUpperCase() : "");

function toggleMenu() {
  menuVisible.value = !menuVisible.value;
}
function toggleUserMenu() {
  userMenuVisible.value = !userMenuVisible.value;
}
function cerrarSesion() {
  usuarioStore.cerrarSesion();
  router.push("/Login");
  userMenuVisible.value = !userMenuVisible.value;

}
</script>


  

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

      .responsive-navbar li{
        background-color:var(--color-2);
        width:100vw !important;
      }

      .nav ul {
      display: flex;
      /*gap: 20px;  /* Espacio entre los enlaces */
      list-style-type: none;
      margin: 0;
      padding: 0;
      margin-right:5vw;
      height:40px;
      align-items:center;
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


      .user-logo{
      display:flex;
      width: 40px;
      height:40px;
      margin:0;
      padding:0;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:14px;
      font-weight:bold;
      background-color:var(--color-9);
      margin-left:1em;
      cursor:pointer;
      transition:all 0.5s;
      outline:solid 1px var(--color-4);
      outline-offset:-2px;
      }

      .user-logo:hover{
      background-color:var(--color-7);
      outline:solid 1px var(--color-8);
      color:var(--color-3);
      }

      .user-icon-hidden{display:none;}
      .user-icon-displayed{display:flex;}
      .user-menu{
        position:fixed;
        flex-direction:column;
        top:50px;
        right:2px;
        width:300px;
        font-size:14px;
        padding:1em;
        text-align:left;
        cursor:pointer;
        z-index:20000;
        display:none;

      }
      .user-menu.menu-visible {
        display:flex;
        
      }
      .user-menu li{
        width:100%;
        background-color:var(--color-2);
        color:var(--color-5);
        list-style:none;
        padding:0.5em;
        padding-left:2em;
      }
      .user-menu li:first-of-type{
        border-radius:5px 5px 0 0;
        cursor:default;
        font-weight:bold;
      }
      .user-menu li:nth-of-type(2){border-bottom:solid 1px var(--color-3);}
      .user-menu li:last-of-type{
        border-radius:0 0 5px 5px;
        border-top:solid 1px var(--color-3);
      }
      .user-menu li:hover{background-color:var(--color-3)}
      #usuarioNombre{
        text-wrap:nowrap;
        overflow-x:hidden;
        text-overflow: ellipsis;
      }
      #usuarioNombre:hover{background-color:var(--color-2);}


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
        display: flex; 
        align-items:center;
        position:absolute;
        top:25px;
        right:12vw
        }

        .menu-visible {
        display: flex !important;
        }

        .nav li {
        padding: 0;
        width:100vw;
        margin:0;
        padding-top:0.5em;
        padding-bottom:0.5em;
        background-color:var(--color-2);
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
        .user-icon-hidden{
          display:flex;
          margin-right:2em;
        }
        .user-icon-displayed{display:none;}
        
      }

    </style>

  
