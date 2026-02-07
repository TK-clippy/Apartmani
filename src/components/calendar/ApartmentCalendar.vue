<template>
  <q-card>
    <q-card-section>
      <q-select
        v-model="selectedApartment"
        :options="apartments"
        option-label="name"
        option-value="id"
        :label="$t('selectApartment')"
        emit-value
        map-options
      />
    </q-card-section>

    <q-separator />

    <q-card-section class="row items-center q-py-sm">
      <q-btn
        flat
        round
        dense
        icon="chevron_left"
        @click="previousMonth"
        :disable="isPreviousMonthDisabled"
      />
      <div class="col text-center text-h6">{{ currentMonthLabel }} {{ currentYear }}</div>
      <q-btn flat round dense icon="chevron_right" @click="nextMonth" />
    </q-card-section>

    <q-separator />

    <q-calendar-month
      v-model="selectedDate"
      :locale="calendarLocale"
      bordered
      animated
      :day-min-height="110"
      @click-date="onClickDate"
      no-active-date
    >
      <template #day="{ scope }">
        <div
          class="q-pa-xs relative-position full-height overflow-hidden"
          :class="{
            'bg-red-1': isBetween(scope.timestamp.date),
            'past-date': isPastDate(scope.timestamp.date),
          }"
          :style="getDayContainerStyle(scope.timestamp.date)"
        >
          <div
            v-if="reservationsForDay(scope.timestamp.date).length"
            class="absolute-full"
            :style="getBookingLayerStyle(scope.timestamp.date)"
          ></div>

          <div class="text-caption text-grey-7 q-mb-xs" style="z-index: 2; position: relative">
            {{ scope.timestamp.day }}
          </div>

          <div
            class="ellipsis text-weight-regular text-white text-caption"
            v-for="res in reservationsForDay(scope.timestamp.date)"
            :key="res.id"
            style="z-index: 2; position: relative"
          >
            {{ res.guestName }}
          </div>
        </div>
      </template>
    </q-calendar-month>

    <ReservationDialog
      v-model="showDialog"
      :start="startDate"
      :end="endDate"
      @save="addReservation"
    />
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { api } from 'boot/axios'
import ReservationDialog from './ReservationDialog.vue'

const $q = useQuasar()
const { t: $t, locale } = useI18n()

const calendarLocale = computed(() => (locale.value === 'hr' ? 'hr-HR' : 'en-US'))

const showDialog = ref(false)
const startDate = ref(null)
const endDate = ref(null)

// Initialize strictly to YYYY-MM-DD local string
const today = new Date().toLocaleDateString('en-CA') // Yields YYYY-MM-DD
const selectedDate = ref(today)

const apartments = ref([])
const selectedApartment = ref(null)
const reservations = ref([])

function normalizeYmd(input) {
  if (!input) return null
  // This ensures we only take the YYYY-MM-DD part regardless of time/zone
  const parts = String(input).match(/(\d{4})-(\d{2})-(\d{2})/)
  return parts ? `${parts[1]}-${parts[2]}-${parts[3]}` : null
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function addDaysUTC(ymd, days) {
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10))
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().substring(0, 10)
}

function startOfMonthYmd(ymd) {
  return ymd.substring(0, 8) + '01'
}

function firstDayNextMonthYmd(ymd) {
  const [y, m] = ymd.split('-').map((v) => parseInt(v, 10))
  const nextY = m === 12 ? y + 1 : y
  const nextM = m === 12 ? 1 : m + 1
  return `${nextY}-${pad2(nextM)}-01`
}

function mapReservationRow(row) {
  const start = normalizeYmd(row.start_date)
  const endExclusive = normalizeYmd(row.end_date)

  // Visual inclusive end for the red bars
  let endInclusive = addDaysUTC(endExclusive, -1)
  if (endInclusive < start) endInclusive = start

  return {
    id: row.id,
    apartmentId: row.apartment_id,
    guestName: row.guest_name,
    start,
    endExclusive,
    end: endInclusive,
  }
}

const currentYear = computed(() => selectedDate.value.substring(0, 4))
const currentMonth = computed(() => parseInt(selectedDate.value.substring(5, 7), 10) - 1)

const currentMonthLabel = computed(() => {
  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  return $t(`months.${monthKeys[currentMonth.value]}`)
})

const isPreviousMonthDisabled = computed(() => {
  return selectedDate.value.substring(0, 7) <= today.substring(0, 7)
})

function previousMonth() {
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCMonth(date.getUTCMonth() - 1)
  selectedDate.value = date.toISOString().substring(0, 10)
}

function nextMonth() {
  const [y, m, d] = selectedDate.value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  date.setUTCMonth(date.getUTCMonth() + 1)
  selectedDate.value = date.toISOString().substring(0, 10)
}

async function fetchApartments() {
  const { data } = await api.get('/apartments')
  apartments.value = Array.isArray(data) ? data : []
  if (!selectedApartment.value && apartments.value.length) {
    selectedApartment.value = apartments.value[0].id
  }
}

async function fetchReservationsForVisibleMonth() {
  if (!selectedApartment.value) return
  const from = startOfMonthYmd(selectedDate.value)
  const to = firstDayNextMonthYmd(selectedDate.value)

  const { data } = await api.get('/reservations', {
    params: { apartmentId: selectedApartment.value, from, to },
  })
  reservations.value = (Array.isArray(data) ? data : []).map(mapReservationRow)
}

watch(
  [selectedApartment, () => selectedDate.value.substring(0, 7)],
  fetchReservationsForVisibleMonth,
  { flush: 'post' },
)

onMounted(async () => {
  try {
    await fetchApartments()
    await fetchReservationsForVisibleMonth()
  } catch (err) {
    $q.notify({ type: 'negative', message: $t('failedToLoadData') })
  }
})

function isPastDate(date) {
  return date < today
}

function reservationsForDay(date) {
  return reservations.value.filter((r) => date >= r.start && date <= r.end)
}

function getBookingLayerStyle(date) {
  const res = reservations.value
  const starts = res.some((r) => r.start === date)
  const ends = res.some((r) => r.end === date)
  const middles = res.some((r) => date > r.start && date < r.end)
  const hasCheckout = res.some((r) => r.endExclusive === date)

  const turnover = starts && hasCheckout

  if (turnover) {
    return {
      background:
        'linear-gradient(135deg, #e53935 0%, #e53935 48%, #fff 48%, #fff 52%, #e53935 52%, #e53935 100%)',
      borderRadius: '4px',
    }
  }
  if (middles) return { background: '#e53935' }
  if (starts) return { background: 'linear-gradient(135deg, transparent 0 50%, #e53935 50%)' }
  if (ends) return { background: 'linear-gradient(135deg, #e53935 0 50%, transparent 50%)' }

  return {}
}

function getDayContainerStyle(date) {
  if (isStart(date)) return { background: 'rgba(229, 57, 53, 0.2)' }
  if (isEnd(date)) return { background: 'rgba(229, 57, 53, 0.2)' }
  return {}
}

function onClickDate({ scope }) {
  const date = scope.timestamp.date
  if (isPastDate(date)) return

  const isOccupied = reservations.value.some((r) => date >= r.start && date < r.endExclusive)
  if (isOccupied) return

  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date
    endDate.value = null
  } else if (date > startDate.value) {
    endDate.value = date
    showDialog.value = true
  } else {
    startDate.value = date
  }
}

async function addReservation(data) {
  try {
    const payload = {
      apartmentId: selectedApartment.value,
      guestName: data.guestName,
      startDate: startDate.value,
      endDate: addDaysUTC(endDate.value, 1), // Checkout is Day + 1
      guestsCount: data.guestsCount,
      notes: data.notes,
    }
    await api.post('/reservations', payload)
    await fetchReservationsForVisibleMonth()
    startDate.value = null
    endDate.value = null
  } catch (err) {
    $q.notify({ type: 'negative', message: $t('failedToSaveReservation') })
  }
}

function isBetween(date) {
  return startDate.value && endDate.value && date > startDate.value && date < endDate.value
}
function isStart(date) {
  return date === startDate.value
}
function isEnd(date) {
  return date === endDate.value
}
</script>
