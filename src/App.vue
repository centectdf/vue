<script setup>
import Header from './components/Header.vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'


</script>

<template>
  <Header />
  <NavBar />
  <main class="d-flex flex-column">
    <router-view></router-view>
  </main>
  <Footer />
</template>
