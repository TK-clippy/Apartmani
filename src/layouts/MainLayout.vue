<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <div class="row items-center q-ml-sm">
          <div class="text-weight-medium">Apartmani</div>
          <q-badge class="q-ml-sm" rounded>internal</q-badge>
        </div>

        <q-space />

        <!-- Desktop nav -->
        <div class="gt-sm row items-center q-gutter-sm">
          <q-btn flat label="Početna" to="/" />
          <q-btn flat label="Kalendar" to="/calendar" />
          <q-btn flat label="Apartmani" to="/apartments" />
          <!-- Dark mode toggle -->
          <q-btn
            flat
            dense
            round
            :icon="$q.dark.isActive ? 'dark_mode' : 'light_mode'"
            class="qa-iconbtn q-ml-sm"
            @click="toggleDark"
          />
        </div>

        <!-- Language -->
        <q-btn-dropdown flat dense icon="language" :label="currentLangLabel">
          <q-list>
            <q-item clickable v-close-popup @click="setLocale('en-US')">
              <q-item-section>English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="setLocale('hr')">
              <q-item-section>Hrvatski</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- User -->
        <q-btn-dropdown flat dense icon="person">
          <q-list>
            <q-item clickable v-close-popup to="/login">
              <q-item-section avatar><q-icon name="login" /></q-item-section>
              <q-item-section>Login</q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item clickable to="/" v-ripple>
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Početna</q-item-section>
        </q-item>

        <q-item clickable to="/calendar" v-ripple>
          <q-item-section avatar><q-icon name="calendar_month" /></q-item-section>
          <q-item-section>Kalendar</q-item-section>
        </q-item>

        <q-item clickable to="/apartments" v-ripple>
          <q-item-section avatar><q-icon name="apartment" /></q-item-section>
          <q-item-section>Apartmani</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const leftDrawerOpen = ref(false)

const currentLocale = ref('hr')
const currentLangLabel = computed(() => (currentLocale.value === 'en-US' ? 'EN' : 'HR'))

function setLocale(loc) {
  currentLocale.value = loc
}

function onLogout() {
  $q.notify({ message: 'Logout (auth uskoro)' })
  router.push('/login')
}

function toggleDark() {
  $q.dark.set(!$q.dark.isActive)
  localStorage.setItem('dark', $q.dark.isActive ? '1' : '0')
}
</script>
