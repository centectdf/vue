// tests/integration/UsuariosPagination.integration.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Usuarios from '../../src/views/Usuarios.vue';
import Pagination from '../../src/components/Pagination.vue';

describe('Integración entre Usuarios y Pagination', () => {
  let wrapper;

  beforeEach(() => {
    // Montar el componente Usuarios con Pagination
    wrapper = mount(Usuarios, {
      global: {
        components: {
          Pagination,
        },
      },
    });
  });

  it('renderiza correctamente el componente Pagination dentro de Usuarios', () => {
    // Verifica que Pagination esté presente en Usuarios
    const pagination = wrapper.findComponent(Pagination);
    expect(pagination.exists()).toBe(true);
  });

  it('cambia de página correctamente cuando se hace clic en Pagination', async () => {
    // Simula datos de usuarios
    wrapper.vm.usuarios = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com', perfiles: [] },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com', perfiles: [] },
      { id: 3, name: 'Usuario 3', email: 'usuario3@example.com', perfiles: [] },
      // ... más usuarios
    ];
  
    // Configura el número de registros por página
    wrapper.vm.registrosPorPagina = 2; // 2 usuarios por página
  
    // Espera a que se actualice el estado
    await wrapper.vm.$nextTick();
  
    // Encuentra el componente Pagination
    const pagination = wrapper.findComponent(Pagination);
  
    // Verifica que la página actual inicial sea 1
    expect(wrapper.vm.paginaActual).toBe(1);
  
    // Simula un clic en la página 2
    await pagination.vm.$emit('cambiar-pagina', 2);
  
    // Espera a que se actualice el estado
    await wrapper.vm.$nextTick();
  
    // Verifica que la página actual en Usuarios se haya actualizado
    expect(wrapper.vm.paginaActual).toBe(2);
  
    // Verifica que los usuarios paginados corresponden a la página 2
    const usuariosPaginados = wrapper.vm.usuariosPaginados;
    expect(usuariosPaginados.length).toBe(1); // Solo debería haber 1 usuario en la página 2
    expect(usuariosPaginados[0].id).toBe(3); // El usuario en la página 2 debería ser el tercero
  });

  it('actualiza la lista de usuarios cuando se cambia el número de registros por página', async () => {
    // Simula datos de usuarios
    wrapper.vm.usuarios = [
      { id: 1, name: 'Usuario 1', email: 'usuario1@example.com', perfiles: [] },
      { id: 2, name: 'Usuario 2', email: 'usuario2@example.com', perfiles: [] },
      // ... más usuarios
    ];

    // Cambia el número de registros por página a 50
    await wrapper.find('select').setValue('50');

    // Verifica que el número de registros por página se haya actualizado
    expect(wrapper.vm.registrosPorPagina).toBe(50);

    // Verifica que los usuarios paginados corresponden al nuevo número de registros por página
    const usuariosPaginados = wrapper.vm.usuariosPaginados;
    expect(usuariosPaginados.length).toBeLessThanOrEqual(50);
  });

  
});