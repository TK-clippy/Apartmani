<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md">
        <!-- Left / Brand -->
        <div class="row items-center q-gutter-sm">
          <div class="text-weight-medium">Apartmani</div>
          <q-badge rounded>internal</q-badge>
        </div>

        <!-- Tabs -->
        <q-tabs
          class="q-ml-lg qa-header-tabs"
          shrink
          dense
          no-caps
          active-color="white"
          indicator-color="white"
        >
          <q-route-tab to="/" label="Početna" exact />
          <q-route-tab to="/calendar" label="Kalendar" />
          <q-route-tab to="/apartments" label="Apartmani" />
        </q-tabs>

        <q-space />

        <!-- Dark mode toggle (DESNO) -->
        <q-toggle
          v-model="isDark"
          checked-icon="dark_mode"
          unchecked-icon="light_mode"
          dense
          class="q-mr-sm"
        />

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
        <q-btn-dropdown flat dense icon="person" class="q-ml-sm">
          <q-list>
            <q-item v-if="!auth.isAuthed" clickable v-close-popup to="/login">
              <q-item-section avatar><q-icon name="login" /></q-item-section>
              <q-item-section>Login</q-item-section>
            </q-item>

            <q-item v-else clickable v-close-popup @click="onLogout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container class="qa-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const { locale } = useI18n()

/** Locale label (pravi i18n) */
const currentLangLabel = computed(() => (locale.value === 'en-US' ? 'EN' : 'HR'))

function setLocale(loc) {
  locale.value = loc
  localStorage.setItem('locale', loc)
}

/** Dark toggle: inicijalno iz localStorage (fallback na $q.dark) */
const savedDark = localStorage.getItem('dark')
const isDark = ref(savedDark ? savedDark === '1' : $q.dark.isActive)

/** Na mountu uskladi Quasar dark sa stanjem (da ne ostane krivo) */
onMounted(() => {
  $q.dark.set(!!isDark.value)
})

/** Sinkronizacija toggle -> Quasar dark */
watch(isDark, (val) => {
  $q.dark.set(!!val)
  localStorage.setItem('dark', val ? '1' : '0')
})

function onLogout() {
  auth.logout()
  router.replace('/login')
}
</script>

<style scoped>
/* Tabovi: inactive malo fade, active full white */
.qa-header-tabs :deep(.q-tab) {
  color: rgba(255, 255, 255, 0.78);
}

.qa-header-tabs :deep(.q-tab--active) {
  color: rgba(255, 255, 255, 1);
  font-weight: 650;
}

/* Indikator tanak i clean */
.qa-header-tabs :deep(.q-tabs__indicator) {
  height: 2px;
  border-radius: 2px;
  opacity: 0.95;
}
</style>
