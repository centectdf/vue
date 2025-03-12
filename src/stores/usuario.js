import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    setUsuario(usuario) {
      this.usuario = usuario
      localStorage.setItem('usuario', JSON.stringify(usuario));

    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token);

    },
    cerrarSesion() {
      this.usuario = null
      this.token = null
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  }
})
