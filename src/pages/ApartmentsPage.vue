<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">{{ $t('apartments') }}</div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          {{ $t('apartmentsHint') }}
        </div>
      </div>

      <q-space />

      <q-btn
        flat
        round
        icon="refresh"
        @click="fetchApartments"
        :loading="loading"
        class="qa-iconbtn"
      />
    </div>

    <q-card class="qa-card">
      <!-- Controls -->
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model="search"
            dense
            outlined
            clearable
            class="qa-search"
            :placeholder="$t('search')"
            debounce="150"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div class="col-12 col-sm-6 row justify-end">
          <q-btn
            unelevated
            color="primary"
            icon="add"
            :label="$t('addApartment')"
            :disable="!auth.isAuthed"
            @click="openCreate"
          >
            <q-tooltip v-if="!auth.isAuthed">{{ $t('loginRequired') }}</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Table -->
      <q-table
        class="qa-table"
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :rows-per-page-options="[10, 20, 50]"
        @row-click="onRowClick"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.name }}</div>
            <div class="text-caption text-grey-6">ID: {{ props.row.id }}</div>
          </q-td>
        </template>

        <template #body-cell-capacity="props">
          <q-td :props="props">
            <span class="qa-pill">
              <q-icon name="group" size="16px" class="q-mr-xs qa-pill__icon" />
              <span class="qa-pill__text">{{ props.row.capacity ?? '—' }}</span>
            </span>
          </q-td>
        </template>

        <template #body-cell-created_at="props">
          <q-td :props="props">
            <span class="text-caption text-grey-7">
              {{ formatDateTime(props.row.created_at) }}
            </span>
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey-7">
            {{ errorMsg || $t('noApartments') }}
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Details dialog -->
    <q-dialog v-model="showDetails">
      <q-card class="qa-card" style="min-width: 420px; max-width: 92vw">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h6">{{ selected?.name }}</div>
            <div class="text-caption text-grey-6">{{ $t('apartmentDetails') }}</div>
          </div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup class="qa-iconbtn" />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selected">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-caption text-grey-6">{{ $t('capacity') }}</div>
              <div class="text-body2">
                <span class="qa-pill qa-pill--big">
                  <q-icon name="group" size="18px" class="q-mr-xs qa-pill__icon" />
                  <span class="qa-pill__text">{{ selected.capacity ?? '—' }}</span>
                </span>
              </div>
            </div>

            <div class="col-12">
              <div class="text-caption text-grey-6">{{ $t('createdAt') }}</div>
              <div class="text-body2">{{ formatDateTime(selected.created_at) }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            color="negative"
            :label="$t('delete')"
            :disable="!auth.isAuthed || !selected"
            :loading="deleting"
            @click="confirmDelete"
          >
            <q-tooltip v-if="!auth.isAuthed">{{ $t('loginRequired') }}</q-tooltip>
          </q-btn>

          <q-btn unelevated color="primary" :label="$t('edit')" disable />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create dialog -->
    <q-dialog v-model="showCreate" persistent>
      <q-card class="qa-card" style="min-width: 460px; max-width: 92vw">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h6">{{ $t('addApartment') }}</div>
            <div class="text-caption text-grey-6">{{ $t('apartmentsHint') }}</div>
          </div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup class="qa-iconbtn" :disable="creating" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input
            v-model.trim="form.name"
            outlined
            :label="$t('name')"
            :disable="creating"
            autofocus
          />

          <q-input
            v-model.number="form.capacity"
            outlined
            type="number"
            :label="$t('capacity')"
            :disable="creating"
            min="0"
          />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" v-close-popup :disable="creating" />
          <q-btn
            unelevated
            color="primary"
            :label="$t('save')"
            :loading="creating"
            :disable="!form.name"
            @click="createApartment"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const $q = useQuasar()
const { t: $t } = useI18n()
const auth = useAuthStore()

const loading = ref(false)
const rows = ref([])
const search = ref('')
const errorMsg = ref('')

const showDetails = ref(false)
const selected = ref(null)

const showCreate = ref(false)
const creating = ref(false)
const deleting = ref(false)
const form = ref({
  name: '',
  capacity: null,
})

const columns = [
  { name: 'name', label: $t('name'), field: 'name', sortable: true, align: 'left' },
  { name: 'capacity', label: $t('capacity'), field: 'capacity', sortable: true, align: 'left' },
  {
    name: 'created_at',
    label: $t('createdAt'),
    field: 'created_at',
    sortable: true,
    align: 'left',
  },
]

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter((r) =>
    String(r.name || '')
      .toLowerCase()
      .includes(q),
  )
})

function onRowClick(_, row) {
  selected.value = row
  showDetails.value = true
}

function formatDateTime(value) {
  if (!value) return ''
  // MySQL DATETIME string: "2026-01-03 21:07:35"
  return String(value).substring(0, 16)
}

async function fetchApartments() {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get('/apartments', { params: { _ts: Date.now() } })
    rows.value = Array.isArray(data) ? data : []
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || err?.message || 'Failed to load'
    $q.notify({ type: 'negative', message: $t('failedToLoadData') })
    rows.value = []
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.value = { name: '', capacity: null }
  showCreate.value = true
}

async function createApartment() {
  if (!auth.isAuthed) return

  creating.value = true
  try {
    await api.post('/apartments', {
      name: form.value.name,
      capacity: form.value.capacity ?? null,
    })

    $q.notify({ type: 'positive', message: $t('saved') || 'Saved' })
    showCreate.value = false
    await fetchApartments()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || err?.message || 'Failed to save',
    })
  } finally {
    creating.value = false
  }
}

function confirmDelete() {
  if (!selected.value) return

  $q.dialog({
    title: $t('deleteApartmentTitle') || 'Delete apartment',
    message:
      ($t('deleteApartmentConfirm') || 'Delete this apartment?') + `\n\n${selected.value.name}`,
    cancel: true,
    persistent: true,
    ok: { label: $t('delete') || 'Delete', color: 'negative' },
  }).onOk(() => deleteSelected())
}

async function deleteSelected() {
  if (!auth.isAuthed || !selected.value) return

  deleting.value = true
  try {
    await api.delete(`/apartments/${selected.value.id}`)
    $q.notify({ type: 'positive', message: $t('deleted') || 'Deleted' })
    showDetails.value = false
    selected.value = null
    await fetchApartments()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err?.response?.data?.message || err?.message || 'Failed to delete',
    })
  } finally {
    deleting.value = false
  }
}

onMounted(fetchApartments)
</script>

<style scoped>
/* “pill” that works in light/dark using your tokens (no hardcoded colors) */
.qa-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--qa-border-light);
  background: rgba(255, 255, 255, 0.6);
  gap: 2px;
}
body.body--dark .qa-pill {
  border: 1px solid var(--qa-border-dark);
  background: rgba(25, 25, 25, 0.65);
}

.qa-pill__icon {
  color: var(--q-primary);
  opacity: 0.95;
}

.qa-pill__text {
  font-weight: 650;
  letter-spacing: 0.2px;
}

.qa-pill--big {
  padding: 8px 12px;
}
</style>
