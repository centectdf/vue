// src/composables/usePagination.js
import { ref, computed } from 'vue';

export function usePagination(items, itemsPerPage) {
  const paginaActual = ref(1);

  const totalPaginas = computed(() => {
    if (itemsPerPage.value === 'todos') {
      return 1;
    }
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  const paginasMostradas = computed(() => {
    const total = totalPaginas.value;
    const actual = paginaActual.value;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (actual <= 3) return [1, 2, 3, 4, 5];
    if (actual >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];

    return [actual - 2, actual - 1, actual, actual + 1, actual + 2];
  });

  const itemsPaginados = computed(() => {
    if (itemsPerPage.value === 'todos') return items.value;
    const start = (paginaActual.value - 1) * itemsPerPage.value;
    return items.value.slice(start, start + itemsPerPage.value);
  });

  const cambiarPagina = (pagina) => {
    paginaActual.value = pagina;
  };

  const paginaAnterior = () => {
    if (paginaActual.value > 1) {
      paginaActual.value--;
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual.value < totalPaginas.value) {
      paginaActual.value++;
    }
  };

  return {
    paginaActual,
    totalPaginas,
    paginasMostradas,
    itemsPaginados,
    cambiarPagina,
    paginaAnterior,
    paginaSiguiente,
  };
}