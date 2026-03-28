<template>
  <q-layout view="hHh lpR fFf" class="client-layout">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="q-px-md">
        <q-btn flat dense icon="arrow_back" label="Natrag" @click="$router.back()" />
        <q-space />
        <div class="text-weight-medium">Rezervacije</div>
        <q-space />
        <q-btn flat dense icon="call" :href="`tel:${phone}`" />
      </q-toolbar>
      <q-separator />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white text-grey-8">
      <q-separator />
      <div class="row items-center justify-between q-px-md q-py-sm">
        <div class="text-caption">© {{ new Date().getFullYear() }} Apartmani</div>
        <div class="text-caption">
          Kontakt: <a class="text-primary" :href="`tel:${phone}`">{{ phone }}</a>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
const phone = '+385 99 123 4567'
</script>

<style scoped>
.client-layout {
  font-family:
    'Manrope',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
