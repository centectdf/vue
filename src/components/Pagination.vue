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

<style scoped>
.pagination {
  display: flex;
  padding-left: 0;
  list-style: none;
  border-radius: 0.25rem;
}

.page-link {
  position: relative;
  display: block;
  padding: 0.25rem 0.5rem;
  margin-left: -1px;
  line-height: 1.25;
  color: var(--color-5);
  background-color: var(--color-1);
  border: 1px solid var(--color-3);
  font-size: 0.875rem;
}

.page-link:hover {
  color: var(--color-5);
  background-color: var(--color-2);
  border-color: var(--color-3);
}

.page-link:focus {
  z-index: 3;
  color: var(--color-5);
  background-color: var(--color-2);
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.page-item:first-child .page-link {
  margin-left: 0;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.page-item:last-child .page-link {
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}

.page-item.active .page-link {
  z-index: 3;
  color: #fff;
  background-color: var(--color-6);
  border-color: var(--color-6);
}

.page-item.disabled .page-link {
  color: var(--color-3);
  pointer-events: none;
  background-color: var(--color-1);
  border-color: var(--color-3);
}
</style>