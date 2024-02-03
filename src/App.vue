<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0 1rem;
}
a {
  text-decoration: none;
  color: #000;
}
a:hover {
  color: #165cac;
}
@media only screen and (min-width: 768px) {
  body {
    margin: 0 2rem;
  }
}
</style>
