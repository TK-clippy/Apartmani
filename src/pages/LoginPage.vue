<template>
  <q-page class="q-pa-lg" style="width: 100%; max-width: 420px">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Login</div>
        <div class="text-body2 text-grey-7 q-mt-xs">Unesi email i lozinku za pristup.</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-input v-model.trim="email" type="email" label="Email" autocomplete="email" />
        <q-input
          v-model="password"
          :type="show ? 'text' : 'password'"
          label="Lozinka"
          autocomplete="current-password"
        >
          <template #append>
            <q-btn
              flat
              round
              dense
              :icon="show ? 'visibility_off' : 'visibility'"
              @click="show = !show"
            />
          </template>
        </q-input>

        <q-btn
          unelevated
          class="full-width"
          label="Prijavi se"
          :loading="loading"
          :disable="!email || !password"
          @click="onLogin"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth.store'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)

async function onLogin() {
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const next = route.query.next || '/'
    await router.replace(next)
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e?.response?.data?.message || e?.message || 'Neuspješna prijava',
    })
  } finally {
    loading.value = false
  }
}
</script>
