<template>
    <nav>
      <ul v-if="usuarioStore.usuario">
        <li class="--forbidden" aria-label="Usuarios">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-user"></i>
          <span class="nav-text">Usuarios</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Perfiles">
          <router-link class="--forbidden" to="#">
          <i class="fa-regular fa-user"></i>
          <span class="nav-text">Perfiles</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Clientes">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-user-group"></i>
          <span class="nav-text">Clientes</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Patrones">
          <router-link class="--forbidden" to="#">
          <i class="fa-regular fa-hard-drive"></i>
          <span class="nav-text">Patrones</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Instrumentos clientes">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-hard-drive"></i>
          <span class="nav-text">Instrumentos clientes</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Ordenes">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-barcode"></i>
          <span class="nav-text">Ordenes</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="IngresosEgresos">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-arrow-right-arrow-left"></i>
          <span class="nav-text">Ingresos / Egresos</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Instrumentos">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-check"></i>
          <span class="nav-text">Instrumentos calibrados</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Nomenclador">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-file-lines"></i>
          <span class="nav-text">Nomenclador</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Actividades">
          <router-link class="--forbidden" to="#">
          <i class="fa-solid fa-helmet-safety"></i>
          <span class="nav-text">Actividades</span>
        </router-link>
        </li>
        <li class="--forbidden" aria-label="Indicadores">
          <router-link class="--forbidden" to="#">
            <i class="fa-solid fa-chart-line"></i>
          <span class="nav-text">Indicadores</span>
        </router-link>
        </li>
        <li class="" aria-label="Gestión de órdenes">
          <router-link class="" to="/GestionOrdenes">
            <i class="fa-solid fa-table-cells-large"></i>
          <span class="nav-text">Gestión de órdenes</span>
        </router-link>
        </li>

      </ul>
    </nav>
  </template>
  <script setup>
  import { useUsuarioStore } from "../stores/usuario.js";
  const usuarioStore = useUsuarioStore();

</script>
  <style scoped>
  nav {
    width: 80px; /* Ancho reducido por defecto */
    background-color: var(--color-5);
    color: var(--color-1);
    text-align: center;
    display: flex;
    flex-direction: column;
    font-size: 1em;
    transition: all 0.5s ease; /* Transición suave para expandir */
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
  }


  nav:hover {
    width: 300px; /* Ancho completo cuando se hace hover */
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;  /* Aseguramos que el ul ocupe todo el ancho disponible */
  }

  li {
    cursor: pointer;
    padding: 1em;
    text-align: left;
    white-space: nowrap;
    display: flex;
    align-items: center;
    transition: all 0.5s ease;
  }

  li:hover {
    background-color: var(--color-4);
    font-weight: bold;
  }

  i {
    margin-right: 10px; /* Espacio entre el ícono y el texto */
    padding-left: 1em;
  }

  /* Se mantendrán ocultos, pero aparecerán al hacer hover en el nav */
  .nav-text {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0.5s ease, opacity 0.5s ease;
    margin-left: 10px;
    display: inline-block; /* Esto asegura que se acomoden en la fila */
  }

  nav:hover .nav-text {
    visibility: visible;
    opacity: 1;
  }

  /* Estilo base de los enlaces */
  nav a {
    color: var(--color-1); /* Usa el color deseado */
    text-decoration: none; /* Quita el subrayado */
    display: flex; /* Asegura que el ícono y el texto estén alineados */
    align-items: center;
    width: 100%; /* Asegura que el enlace ocupe todo el espacio del li */
    /*padding: 1em 0;*/
  }

  /* Cambia el color al pasar el mouse */
  nav a:hover {
    color: var(--color-3); /* Cambia el color en hover */
  }

  /* Remueve los estilos de enlace visitado */
  nav a:visited {
    color: var(--color-1);
  }
@media (max-width: 930px) {
  nav{
    display:none;
  }
}


  </style>
  