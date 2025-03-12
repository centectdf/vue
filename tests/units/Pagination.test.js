// tests/unit/Pagination.test.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../../src/components/Pagination.vue';

describe('Pagination.vue', () => {
  it('renderiza correctamente con las props proporcionadas', () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 1,
        totalPaginas: 10,
      },
    });

    // Verifica que el componente se renderiza
    expect(wrapper.exists()).toBe(true);

    // Verifica que se muestran los botones de paginación
    expect(wrapper.find('.pagination').exists()).toBe(true);
    expect(wrapper.findAll('.page-item').length).toBeGreaterThan(0);
  });

  it('calcula correctamente las páginas mostradas', async () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 5,
        totalPaginas: 10,
      },
    });

    // Verifica que las páginas mostradas son correctas
    const paginasMostradas = wrapper.vm.paginasMostradas;
    expect(paginasMostradas).toEqual([3, 4, 5, 6, 7]);
  });

  it('emite el evento "cambiar-pagina" al hacer clic en un botón de página', async () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 1,
        totalPaginas: 10,
      },
    });

    // Simula un clic en la página 2
    await wrapper.findAll('.page-link')[2].trigger('click'); // El índice 2 corresponde a la página 2

    // Verifica que se emite el evento con el valor correcto
    expect(wrapper.emitted('cambiar-pagina')).toBeTruthy();
    expect(wrapper.emitted('cambiar-pagina')[0]).toEqual([2]);
  });

  it('emite el evento "cambiar-pagina" al hacer clic en el botón "Anterior"', async () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 2,
        totalPaginas: 10,
      },
    });

    // Simula un clic en el botón "Anterior"
    await wrapper.find('.page-link').trigger('click');

    // Verifica que se emite el evento con el valor correcto
    expect(wrapper.emitted('cambiar-pagina')).toBeTruthy();
    expect(wrapper.emitted('cambiar-pagina')[0]).toEqual([1]);
  });

  it('emite el evento "cambiar-pagina" al hacer clic en el botón "Siguiente"', async () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 2,
        totalPaginas: 10,
      },
    });

    // Simula un clic en el botón "Siguiente"
    await wrapper.findAll('.page-link').at(-1).trigger('click');

    // Verifica que se emite el evento con el valor correcto
    expect(wrapper.emitted('cambiar-pagina')).toBeTruthy();
    expect(wrapper.emitted('cambiar-pagina')[0]).toEqual([3]);
  });

  it('desactiva los botones "Anterior" y "Siguiente" cuando corresponde', async () => {
    const wrapper = mount(Pagination, {
      props: {
        paginaActual: 1,
        totalPaginas: 10,
      },
    });

    // Verifica que el botón "Anterior" está desactivado
    expect(wrapper.find('.page-item:first-child').classes()).toContain('disabled');

    // Cambia a la última página
    await wrapper.setProps({ paginaActual: 10 });

    // Verifica que el botón "Siguiente" está desactivado
    expect(wrapper.find('.page-item:last-child').classes()).toContain('disabled');
  });
});