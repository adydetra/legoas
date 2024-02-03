<template>
  <main>
    <img src="/logo.png" alt="logo">
    <router-link to="/data-piutang-unit">
      🔵 Data Piutang Unit
    </router-link>
  </main>
</template>

<style scoped>
main {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
img {
  width: 14rem;
}
a {
  font-size: 1rem;
  margin: 2.5rem 0 0 0;
}
</style>
