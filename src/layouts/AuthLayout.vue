<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="qa-auth-bg">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.qa-auth-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

