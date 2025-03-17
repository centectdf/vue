<template>
    <div class="--bg-color-26 w-100 h-100 login-cont">
        <div class="--bg-color-2 login-div">
            <img class="logo-login mt-3" src="/src/assets/Logo-cen-tec-horizontal.png">
            <form class="my-4 w-80 d-flex flex-column" @submit.prevent="login">
                <label class="form-label">Email: </label>
                <input type="text" v-model="email" placeholder="Email de usuario" class="form-control mb-4">
                <label class="form-label">Contraseña: </label>
                <input type="password" v-model="password" class="form-control mb-4" placeholder="Contraseña">
                <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                <p v-if="error" class="text-danger">{{ error }}</p>
            </form>
            <p class="text-danger --cursor-pointer --text-danger-hover">Olvidé mi contraseña</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsuarioStore } from "../stores/usuario";
import api from "../api/api";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const usuarioStore = useUsuarioStore();
const router = useRouter();

const login = async () => {
    error.value = "";
    try {
        const response = await api.login(email.value, password.value);
        if (response.data.success) {
            usuarioStore.setUsuario(response.data.usuario);
            usuarioStore.setToken(response.data.token);
            router.push("/");
        } else {
            error.value = response.data.message;
        }
    } catch (err) {
        error.value = "Error en el servidor";
    }
};
</script>

<style scoped>
.login-cont{
  display:flex;
  align-items:flex-start;
  justify-content:center;
  padding-top:5vh;

}
  .login-div{
    height:52vh;
    width:40vw;
    padding:2em;
    display:flex;
    flex-direction:column;
    align-items:center;
    border-radius:5%;

  }
  .logo-login{
    max-width:250px;
  }
</style>