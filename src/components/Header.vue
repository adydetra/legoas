<script setup>
const home = ({
  icon: 'pi pi-home',
  route: '/',
});
const items = ([
  { label: 'Daftar Piutang Unit' },
]);
</script>

<template>
  <header>
    <Breadcrumb id="breadcrumb" :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span class="text-color" :class="[item.icon]" />
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-color">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
    <h1>Data Piutang</h1>
  </header>
</template>

<style scoped>
#breadcrumb {
  margin: 1rem 0;
}
.p-breadcrumb{
  padding: 1rem 0;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header span, h1 {
  font-size: 14px;
}
@media only screen and (min-width: 768px) {
  h1 {
    font-size: 18px;
  }
}
</style>
