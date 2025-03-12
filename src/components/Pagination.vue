<template>
  <nav aria-label="Paginación de tabla">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: paginaActual === 1 }">
        <a class="page-link" href="#" @click.prevent="paginaAnterior" title="Página anterior">Anterior</a>
      </li>

      <li class="page-item" v-if="paginaActual > 3">
        <a class="page-link" href="#" @click.prevent="cambiarPagina(1)" title="Página">1</a>
      </li>

      <li class="page-item disabled" v-if="paginaActual > 4">
        <span class="page-link">...</span>
      </li>

      <li
        class="page-item"
        v-for="pagina in paginasMostradas"
        :key="pagina"
        :class="{ active: pagina === paginaActual }"
      >
        <a class="page-link" href="#" @click.prevent="cambiarPagina(pagina)" :title="`Página ${pagina}`">
          {{ pagina }}
        </a>
      </li>

      <li class="page-item disabled" v-if="paginaActual < totalPaginas - 3">
        <span class="page-link">...</span>
      </li>

      <li class="page-item" v-if="paginaActual < totalPaginas - 2">
        <a class="page-link" href="#" @click.prevent="cambiarPagina(totalPaginas)" :title="`Página ${totalPaginas}`">
          {{ totalPaginas }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
        <a class="page-link" href="#" @click.prevent="paginaSiguiente" title="Página siguiente">Siguiente</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  paginaActual: {
    type: Number,
    required: true,
  },
  totalPaginas: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['cambiar-pagina']);

const paginasMostradas = computed(() => {
  const total = props.totalPaginas;
  const actual = props.paginaActual;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (actual <= 3) return [1, 2, 3, 4, 5];
  if (actual >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];

  return [actual - 2, actual - 1, actual, actual + 1, actual + 2];
});

const cambiarPagina = (pagina) => {
  emit('cambiar-pagina', pagina);
};

const paginaAnterior = () => {
  emit('cambiar-pagina', props.paginaActual - 1);
};

const paginaSiguiente = () => {
  emit('cambiar-pagina', props.paginaActual + 1);
};
</script>