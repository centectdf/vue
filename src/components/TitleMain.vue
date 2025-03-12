<template>
    <h1 class="title">{{ text }}</h1>
  </template>
  
  <script setup>
  defineProps({
    text: {
      type: String,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .title {
    color: var(--color-4);
    border:none;
    box-shadow: 0 2px var(--color-3);
    text-align: right;
    margin:1em;
    padding-bottom:0.5em;
    padding-right:1em;


  }
  </style>
  