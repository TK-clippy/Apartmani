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

    <!-- Month/Year Navigation -->
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
      bordered
      animated
      :day-min-height="110"
      @click-date="onClickDate"
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
          <!-- background booking layer -->
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import ReservationDialog from './ReservationDialog.vue'

const $q = useQuasar()
const { t: $t } = useI18n()

const showDialog = ref(false)
const startDate = ref(null)
const endDate = ref(null)

// Initialize to current date
const today = new Date().toISOString().substring(0, 10)
const selectedDate = ref(today)
const selectedApartment = ref(1)

const apartments = ref([
  { id: 1, name: 'Apartman Ana' },
  { id: 2, name: 'Apartman More' },
])

const reservations = ref([
  {
    id: 1,
    apartmentId: 1,
    guestName: 'Marko Marković',
    start: '2025-01-10',
    end: '2025-01-14',
  },
  {
    id: 2,
    apartmentId: 1,
    guestName: 'Ana Horvat',
    start: '2025-01-18',
    end: '2025-01-20',
  },
])

// Month navigation computed properties
const currentYear = computed(() => {
  return new Date(selectedDate.value).getFullYear()
})

const currentMonth = computed(() => {
  return new Date(selectedDate.value).getMonth()
})

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
  const currentDate = new Date()
  const selectedDateObj = new Date(selectedDate.value)

  // Disable if we're viewing current month or earlier
  return (
    selectedDateObj.getFullYear() <= currentDate.getFullYear() &&
    selectedDateObj.getMonth() <= currentDate.getMonth()
  )
})

function previousMonth() {
  const date = new Date(selectedDate.value)
  date.setMonth(date.getMonth() - 1)
  selectedDate.value = date.toISOString().substring(0, 10)
}

function nextMonth() {
  const date = new Date(selectedDate.value)
  date.setMonth(date.getMonth() + 1)
  selectedDate.value = date.toISOString().substring(0, 10)
}

function isPastDate(date) {
  return date < today
}

function reservationsForDay(date) {
  return reservations.value.filter(
    (r) => r.apartmentId === selectedApartment.value && date >= r.start && date <= r.end,
  )
}

function getBookingLayerStyle(date) {
  const dayRes = reservationsForDay(date)
  if (!dayRes.length) return {}

  const starts = dayRes.some((r) => r.start === date)
  const ends = dayRes.some((r) => r.end === date)
  const middles = dayRes.some((r) => date > r.start && date < r.end)
  const turnover = starts && ends && dayRes.length >= 2 && !middles

  if (turnover) {
    return {
      background: `linear-gradient(
        135deg,
        #e53935 0%,
        #e53935 49%,
        #fff 49%,
        #fff 51%,
        #e53935 51%,
        #e53935 100%
      )`,
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  if (middles) {
    return {
      background: '#e53935',
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  if (starts && !ends) {
    return {
      background: 'linear-gradient(135deg, #fff 0 50%, #e53935 50%)',
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  if (ends && !starts) {
    return {
      background: 'linear-gradient(135deg, #e53935 0 50%, #fff 50%)',
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  return {
    background: '#e53935',
    borderRadius: '8px',
    overflow: 'hidden',
  }
}

function getDayContainerStyle(date) {
  if (isStart(date)) {
    return {
      background: 'linear-gradient(135deg, transparent 50%, rgba(229, 57, 53, 0.6) 50%)',
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  if (isEnd(date)) {
    return {
      background: 'linear-gradient(315deg, transparent 50%, rgba(229, 57, 53, 0.6) 50%)',
      borderRadius: '8px',
      overflow: 'hidden',
    }
  }
  return {}
}

function onClickDate({ scope }) {
  const date = scope.timestamp.date

  // Prevent booking in the past
  if (isPastDate(date)) {
    $q.notify({
      type: 'negative',
      message: $t('cannotBookPastDates'),
      position: 'top',
    })
    return
  }

  // Check if date is occupied
  const isOccupied = reservations.value.some(
    (r) => r.apartmentId === selectedApartment.value && date >= r.start && date < r.end,
  )

  if (isOccupied) {
    return
  }

  // First click → start
  if (!startDate.value) {
    startDate.value = date
    endDate.value = null
    return
  }

  // Second click → end
  if (!endDate.value && date > startDate.value) {
    endDate.value = date
    showDialog.value = true
    return
  }

  // Reset if clicked again
  startDate.value = date
  endDate.value = null
}

function addReservation(data) {
  reservations.value.push({
    id: Date.now(),
    apartmentId: selectedApartment.value,
    ...data,
  })
  startDate.value = null
  endDate.value = null
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
.past-date {
  opacity: 0.4;
  pointer-events: none;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.03) 10px,
    rgba(0, 0, 0, 0.03) 20px
  );
}
</style>
