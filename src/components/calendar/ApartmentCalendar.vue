<template>
  <q-card class="qa-card qa-calendar-card">
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
      class="qa-calendar"
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
          class="qa-day q-pa-xs relative-position full-height overflow-hidden"
          :class="{
            'qa-day--range': isBetween(scope.timestamp.date),
            'qa-day--past': isPastDate(scope.timestamp.date),
            'qa-day--start': isStart(scope.timestamp.date),
            'qa-day--end': isEnd(scope.timestamp.date),
          }"
          :style="getDayContainerStyle(scope.timestamp.date)"
        >
          <div
            v-if="reservationsForDay(scope.timestamp.date).length"
            class="absolute-full cursor-pointer"
            :style="getBookingLayerStyle(scope.timestamp.date)"
            @click.stop="openReservationActions(scope.timestamp.date)"
          ></div>

          <div class="text-caption text-grey-7 q-mb-xs" style="z-index: 2; position: relative">
            {{ scope.timestamp.day }}
          </div>

          <div
            v-for="res in reservationsForDay(scope.timestamp.date)"
            :key="res.id"
            class="relative-position"
            style="z-index: 3"
          >
            <div
              v-if="shouldShowGuestName(scope.timestamp.date, res)"
              class="ellipsis text-caption q-pl-xs"
              :style="getNameStyle()"
            >
              {{ res.guestName }}
            </div>
          </div>
        </div>
      </template>
    </q-calendar-month>

    <ReservationDialog
      v-model="showDialog"
      :start="startDate"
      :end="endDate"
      :reservation="editingReservation"
      @save="handleReservationSave"
    />

    <q-dialog v-model="showResActions">
      <q-card class="qa-card" style="min-width: 380px; max-width: 92vw">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h6">{{ selectedReservation?.guestName }}</div>
            <div class="text-caption text-grey-6">
              {{ $t('calendarReservations') }}
            </div>
          </div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section v-if="selectedReservation">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-caption text-grey-6">{{ $t('dateRange') }}</div>
              <div class="text-body2">
                {{ formatNiceDate(selectedReservation.start) }} —
                {{ formatNiceDate(selectedReservation.endExclusive) }}
              </div>
            </div>

            <div class="col-12" v-if="selectedReservation.guestsCount != null">
              <div class="text-caption text-grey-6">{{ $t('guests') }}</div>
              <div class="text-body2">{{ selectedReservation.guestsCount }}</div>
            </div>

            <div class="col-12" v-if="selectedReservation.notes">
              <div class="text-caption text-grey-6">{{ $t('notes') }}</div>
              <div class="text-body2">"{{ selectedReservation.notes }}"</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat color="negative" :label="$t('delete')" @click="confirmDelete" />
          <q-btn unelevated color="primary" :label="$t('edit')" @click="openEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
const startDate = ref(null) // YYYY-MM-DD (UI inclusive start)
const endDate = ref(null) // YYYY-MM-DD (UI inclusive end)

const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
const selectedDate = ref(today)

const apartments = ref([])
const selectedApartment = ref(null)
const reservations = ref([])

// Admin actions dialog
const showResActions = ref(false)
const selectedReservation = ref(null)

// Unified dialog (create/edit)
const editingReservation = ref(null)

/* i18n month keys (must match your months.* translations) */
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

/** Tooltip date: use i18n months, parse YYYY-MM-DD correctly */
function formatNiceDate(dateStr) {
  if (!dateStr) return ''
  const [, mStr, dStr] = dateStr.split('-') // YYYY-MM-DD
  const m = parseInt(mStr, 10)
  const d = parseInt(dStr, 10)

  const monthName = $t(`months.${monthKeys[m - 1]}`)
  return locale.value === 'hr' ? `${d}. ${monthName}` : `${monthName} ${d}`
}

/** Name label: show on 2nd day if possible, otherwise on start day */
function labelDayForReservation(r) {
  const secondDay = addDaysUTC(r.start, 1)
  if (secondDay < r.endExclusive) return secondDay
  return r.start
}

function shouldShowGuestName(date, r) {
  if (date === labelDayForReservation(r)) return true

  // optional: show on Monday if spanning weeks
  const d = new Date(date)
  if (d.getDay() === 1 && date > r.start && date < r.endExclusive) return true

  return false
}

/** ALL WHITE names + readable */
function getNameStyle() {
  return {
    color: '#fff',
    fontWeight: '600',
    fontSize: '0.75rem',
    paddingLeft: '2px',
    textShadow: '0 1px 2px rgba(0,0,0,.35)',
  }
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
  const start = row.start_date // YYYY-MM-DD
  const endExclusive = row.end_date // YYYY-MM-DD (checkout day)
  const end = addDaysUTC(endExclusive, -1) // inclusive end for visuals

  return {
    id: row.id,
    apartmentId: row.apartment_id,
    guestName: row.guest_name,
    guestsCount: row.guests_count ?? row.guestsCount ?? null,
    notes: row.notes ?? null,
    start,
    endExclusive,
    end,
  }
}

const currentYear = computed(() => selectedDate.value.substring(0, 4))
const currentMonth = computed(() => parseInt(selectedDate.value.substring(5, 7), 10) - 1)

const currentMonthLabel = computed(() => $t(`months.${monthKeys[currentMonth.value]}`))

const isPreviousMonthDisabled = computed(
  () => selectedDate.value.substring(0, 7) <= today.substring(0, 7),
)

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
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    $q.notify({ type: 'negative', message: $t('failedToLoadData') })
  }
})

function isPastDate(date) {
  return date < today
}

function reservationsForDay(date) {
  // include checkout day (endExclusive) for the "cut" visuals
  return reservations.value.filter((r) => date >= r.start && date <= r.endExclusive)
}

function openReservationActions(date) {
  const list = reservationsForDay(date)
  if (!list.length) return
  selectedReservation.value = list[0]
  showResActions.value = true
}

function openEdit() {
  if (!selectedReservation.value) return

  // set edit target
  editingReservation.value = selectedReservation.value

  // set dialog dates (UI expects inclusive end)
  startDate.value = selectedReservation.value.start
  endDate.value = addDaysUTC(selectedReservation.value.endExclusive, -1)

  showResActions.value = false
  showDialog.value = true
}

async function confirmDelete() {
  const id = selectedReservation.value?.id
  console.log('DELETE clicked id:', id)
  if (!id) return

  await handleReservationDelete(id)
  showResActions.value = false
  selectedReservation.value = null
}

/** Booking layer visuals (uses Quasar theme tokens) */
function getBookingLayerStyle(date) {
  const res = reservations.value
  const starts = res.some((r) => r.start === date)
  const isCheckoutDay = res.some((r) => r.endExclusive === date)
  const middles = res.some((r) => date > r.start && date < r.endExclusive)

  const turnover = starts && isCheckoutDay
  const C = 'var(--q-primary)'

  if (turnover) {
    return {
      background: `linear-gradient(135deg,
        ${C} 0%, ${C} 48%,
        transparent 48%, transparent 52%,
        ${C} 52%, ${C} 100%)`,
      borderRadius: 'var(--qa-radius-xs)',
      opacity: '0.95',
    }
  }

  if (middles) return { background: C, opacity: '0.9' }
  if (starts)
    return { background: `linear-gradient(135deg, transparent 0 50%, ${C} 50%)`, opacity: '0.95' }
  if (isCheckoutDay)
    return { background: `linear-gradient(135deg, ${C} 0 50%, transparent 50%)`, opacity: '0.95' }

  return {}
}

function getDayContainerStyle(date) {
  if (isStart(date) || isEnd(date)) {
    return { background: 'color-mix(in srgb, var(--q-primary) 12%, transparent)' }
  }
  return {}
}

function onClickDate({ scope }) {
  const date = scope.timestamp.date
  if (isPastDate(date)) return

  const isOccupied = reservations.value.some((r) => date >= r.start && date < r.endExclusive)
  if (isOccupied) return

  // create mode
  if (!startDate.value || (startDate.value && endDate.value)) {
    editingReservation.value = null
    startDate.value = date
    endDate.value = null
  } else if (date > startDate.value) {
    editingReservation.value = null
    endDate.value = date
    showDialog.value = true
  } else {
    startDate.value = date
  }
}

/**
 * Unified SAVE handler for ReservationDialog (create or edit)
 * payload: { id?, guestName, guestsCount, notes, start, end }  // end is inclusive in UI
 */
async function handleReservationSave(payload) {
  try {
    const body = {
      apartmentId: selectedApartment.value,
      guestName: payload.guestName,
      startDate: payload.start,
      endDate: addDaysUTC(payload.end, 1), // checkout exclusive
      guestsCount: payload.guestsCount,
      notes: payload.notes,
    }

    if (payload.id) {
      await api.put(`/reservations/${payload.id}`, body)
    } else {
      await api.post('/reservations', body)
    }

    await fetchReservationsForVisibleMonth()
    startDate.value = null
    endDate.value = null
    editingReservation.value = null
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: payload.id ? $t('failedToUpdateReservation') : $t('failedToSaveReservation'),
    })
  }
}

async function handleReservationDelete(id) {
  try {
    await api.delete(`/reservations/${id}`)
    await fetchReservationsForVisibleMonth()
    editingReservation.value = null
    $q.notify({ type: 'positive', message: $t('reservationDeleted') })
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    $q.notify({ type: 'negative', message: $t('failedToDeleteReservation') })
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

<style scoped>
.qa-calendar-card {
  padding: 6px;
}

.qa-calendar :deep(.q-calendar-month) {
  border-radius: var(--qa-radius);
}

.qa-day {
  border-radius: var(--qa-radius-xs);
  transition:
    transform 120ms ease,
    background 120ms ease,
    box-shadow 120ms ease;
}

.qa-day--past {
  opacity: 0.55;
  filter: grayscale(0.15);
}

.qa-day--range {
  background: color-mix(in srgb, var(--q-primary) 10%, transparent);
}

.qa-day--start,
.qa-day--end {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--q-primary) 28%, transparent) inset;
}

.qa-calendar :deep(.q-calendar-month__day) {
  padding: 6px;
}

.qa-calendar :deep(.q-calendar-month__day-label) {
  font-weight: 600;
  opacity: 0.72;
}

.qa-calendar :deep(.q-tooltip) {
  border-radius: var(--qa-radius-sm);
}
</style>
