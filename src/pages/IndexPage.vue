<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Header -->
        <div class="q-mb-md">
          <div class="text-h5 text-weight-bold">{{ $t('dashboardTitle') }}</div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            {{ $t('dashboardSubtitle') }}
          </div>
        </div>

        <!-- Primary actions -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center justify-between q-gutter-sm">
            <div>
              <div class="text-subtitle1 text-weight-medium">{{ $t('occupancyCalendar') }}</div>
              <div class="text-body2 text-grey-7 q-mt-xs">
                {{ $t('occupancyCalendarHint') }}
              </div>
            </div>

            <div class="row q-gutter-sm">
              <q-btn unelevated icon="calendar_month" :label="$t('openCalendar')" to="/calendar" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Apartment picker + refresh -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center q-col-gutter-md">
            <div class="col-12 col-md">
              <q-select
                v-model="selectedApartment"
                :options="apartments"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                dense
                outlined
                :label="$t('selectApartment')"
                :loading="loadingApartments"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Stats tiles -->
        <div class="row q-col-gutter-md q-mb-md items-stretch">
          <!-- Arrivals -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">{{ $t('arrivalsToday') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('checkIn') }}</div>
                </div>
                <q-chip dense icon="login">{{ arrivalsToday.length }}</q-chip>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                <template v-if="loadingReservations">
                  <q-skeleton type="text" />
                  <q-skeleton type="text" width="60%" />
                </template>

                <template v-else-if="arrivalsToday.length === 0">
                  {{ $t('noArrivalsToday') }}
                </template>

                <template v-else>
                  <div v-for="r in arrivalsToday" :key="r.id" class="row items-center q-mb-xs">
                    <q-icon name="person" size="xs" class="q-mr-sm" />
                    <div class="ellipsis">{{ r.guestName }}</div>
                  </div>
                </template>

                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="calendar_month"
                    :label="$t('viewInCalendar')"
                    to="/calendar"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Departures -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height">
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">{{ $t('departuresToday') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('checkOut') }}</div>
                </div>
                <q-chip dense icon="logout">{{ departuresToday.length }}</q-chip>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                <template v-if="loadingReservations">
                  <q-skeleton type="text" />
                  <q-skeleton type="text" width="60%" />
                </template>

                <template v-else-if="departuresToday.length === 0">
                  {{ $t('noDeparturesToday') }}
                </template>

                <template v-else>
                  <div v-for="r in departuresToday" :key="r.id" class="row items-center q-mb-xs">
                    <q-icon name="person" size="xs" class="q-mr-sm" />
                    <div class="ellipsis">{{ r.guestName }}</div>
                  </div>
                </template>

                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="calendar_month"
                    :label="$t('viewInCalendar')"
                    to="/calendar"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Next 7 days -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height qa-tile">
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">{{ $t('next7Days') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('quickInsight') }}</div>
                </div>
                <q-icon name="query_stats" size="sm" class="text-grey-7" />
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7 qa-tile__body">
                <template v-if="loadingReservations">
                  <q-skeleton type="text" />
                  <q-skeleton type="text" width="70%" />
                </template>

                <template v-else>
                  <div class="row q-col-gutter-sm">
                    <div class="col">
                      <div class="text-caption text-grey-7">{{ $t('arrivals') }}</div>
                      <div class="text-subtitle1 text-weight-medium">{{ arrivals7.length }}</div>
                    </div>
                    <div class="col">
                      <div class="text-caption text-grey-7">{{ $t('departures') }}</div>
                      <div class="text-subtitle1 text-weight-medium">{{ departures7.length }}</div>
                    </div>
                  </div>

                  <div class="q-mt-sm">
                    <q-btn
                      flat
                      dense
                      icon="search"
                      :label="$t('checkAvailability')"
                      to="/calendar"
                    />
                  </div>
                </template>
              </q-card-section>
            </q-card>
          </div>

          <!-- Apartments -->
          <div class="col-12 col-md-6">
            <q-card flat bordered class="full-height qa-tile">
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">{{ $t('apartmentsTitle') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('overviewAndSettings') }}</div>
                </div>
                <q-icon name="apartment" size="sm" class="text-grey-7" />
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7 qa-tile__body">
                <div class="row items-center">
                  <div>{{ $t('totalApartments') }}</div>
                  <q-space />
                  <div class="text-weight-medium">{{ apartments.length }}</div>
                </div>

                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="chevron_right"
                    :label="$t('openApartments')"
                    to="/apartments"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Errors -->
        <q-banner v-if="errorMsg" class="bg-negative text-white q-mb-md" rounded>
          {{ errorMsg }}
        </q-banner>

        <!-- Recent activity (simple: next arrivals sorted) -->
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-medium">{{ $t('recentActivity') }}</div>
              <div class="text-caption text-grey-7">{{ $t('recentActivityHint') }}</div>
            </div>
            <q-btn flat dense icon="refresh" :label="$t('refresh')" @click="refreshAll" />
          </q-card-section>

          <q-separator />

          <q-card-section class="text-body2 text-grey-7">
            <template v-if="loadingReservations">
              <q-skeleton type="text" />
              <q-skeleton type="text" width="80%" />
              <q-skeleton type="text" width="60%" />
            </template>

            <template v-else-if="upcomingSorted.length === 0">
              {{ $t('noActivity') }}
            </template>

            <template v-else>
              <div
                v-for="r in upcomingSorted.slice(0, 8)"
                :key="r.id"
                class="row items-center q-py-xs"
              >
                <q-icon name="event" size="xs" class="q-mr-sm" />
                <div class="ellipsis">
                  <span class="text-weight-medium">{{ r.guestName }}</span>
                  — {{ r.start }} → {{ r.endExclusive }}
                </div>
              </div>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t: $t } = useI18n()

const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD

const loadingApartments = ref(false)
const loadingReservations = ref(false)
const errorMsg = ref('')

const apartments = ref([])
const selectedApartment = ref(null)
const reservations = ref([])

function addDaysUTC(ymd, days) {
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10))
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().substring(0, 10)
}

function startOfWeekFromToday() {
  return today
}
function endOf7Days() {
  return addDaysUTC(today, 7)
}

function mapReservationRow(row) {
  // backend returns snake_case
  return {
    id: row.id,
    guestName: row.guest_name,
    start: row.start_date,
    endExclusive: row.end_date,
    guestsCount: row.guests_count ?? null,
    notes: row.notes ?? null,
  }
}

const arrivalsToday = computed(() => reservations.value.filter((r) => r.start === today))
const departuresToday = computed(() => reservations.value.filter((r) => r.endExclusive === today))

const arrivals7 = computed(() => {
  const to = endOf7Days()
  return reservations.value.filter((r) => r.start >= today && r.start < to)
})
const departures7 = computed(() => {
  const to = endOf7Days()
  return reservations.value.filter((r) => r.endExclusive >= today && r.endExclusive < to)
})

const upcomingSorted = computed(() => {
  // simple “activity”: upcoming arrivals sorted by start
  return [...reservations.value].sort((a, b) =>
    a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
  )
})

async function fetchApartments() {
  loadingApartments.value = true
  try {
    const { data } = await api.get('/apartments')
    apartments.value = Array.isArray(data) ? data : []
    if (!selectedApartment.value && apartments.value.length) {
      selectedApartment.value = apartments.value[0].id
    }
  } finally {
    loadingApartments.value = false
  }
}

async function fetchReservations() {
  if (!selectedApartment.value) return
  loadingReservations.value = true
  errorMsg.value = ''
  try {
    const from = startOfWeekFromToday()
    const to = endOf7Days()

    const { data } = await api.get('/reservations', {
      params: { apartmentId: selectedApartment.value, from, to },
    })

    reservations.value = (Array.isArray(data) ? data : []).map(mapReservationRow)
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    errorMsg.value = $t('failedToLoadData')
    $q.notify({ type: 'negative', message: $t('failedToLoadData') })
  } finally {
    loadingReservations.value = false
  }
}

async function refreshAll() {
  await fetchApartments()
  await fetchReservations()
}

watch(selectedApartment, fetchReservations)

onMounted(refreshAll)
</script>
