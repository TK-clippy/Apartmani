<template>
  <q-card>
    <q-card-section>
      <q-select
        v-model="selectedApartment"
        :options="apartments"
        option-label="name"
        option-value="id"
        label="Odaberi apartman"
        emit-value
        map-options
      />
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
          class="day-container"
          :class="{
            start: isStart(scope.timestamp.date),
            end: isEnd(scope.timestamp.date),
            between: isBetween(scope.timestamp.date),
          }"
        >
          <!-- one background layer per day -->
          <div
            v-if="reservationsForDay(scope.timestamp.date).length"
            class="booking-layer"
            :class="getDayBookingClass(scope.timestamp.date)"
          />

          <div class="date-label">{{ scope.timestamp.day }}</div>

          <!-- show names normally (no absolute full-cover blocks) -->
          <div class="guest" v-for="res in reservationsForDay(scope.timestamp.date)" :key="res.id">
            {{ res.guestName }}
          </div>
        </div>
      </template>
    </q-calendar-month>
  </q-card>
  <ReservationDialog
    v-model="showDialog"
    :start="startDate"
    :end="endDate"
    @save="addReservation"
  />
</template>

<script setup>
import { ref } from 'vue'
import ReservationDialog from './ReservationDialog.vue'

const showDialog = ref(false)
const startDate = ref(null)
const endDate = ref(null)
const selectedDate = ref(new Date().toISOString().substring(0, 10))
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

function reservationsForDay(date) {
  return reservations.value.filter(
    (r) => r.apartmentId === selectedApartment.value && date >= r.start && date <= r.end,
  )
}

function getDayBookingClass(date) {
  const dayRes = reservationsForDay(date)
  if (!dayRes.length) return ''

  const starts = dayRes.some((r) => r.start === date)
  const ends = dayRes.some((r) => r.end === date)
  const middles = dayRes.some((r) => date > r.start && date < r.end)

  // 5th state: checkout + checkin on the same day (usually 2 reservations that day)
  const turnover = starts && ends && dayRes.length >= 2 && !middles

  if (turnover) return 'bg-turnover'
  if (middles) return 'bg-full'
  if (starts && !ends) return 'bg-start'
  if (ends && !starts) return 'bg-end'

  // fallback (e.g. start === end single-day reservation)
  return 'bg-full'
}

function onClickDate({ scope }) {
  const date = scope.timestamp.date

  // Check if this date is truly occupied (start or middle, but NOT end)
  const isOccupied = reservations.value.some(
    (r) => r.apartmentId === selectedApartment.value && date >= r.start && date < r.end,
  )

  // Can't click if occupied
  if (isOccupied) {
    return
  }

  // prvi klik → start
  if (!startDate.value) {
    startDate.value = date
    endDate.value = null
    return
  }

  // drugi klik → end
  if (!endDate.value && date > startDate.value) {
    endDate.value = date
    showDialog.value = true
    return
  }

  // reset ako klikneš opet
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
/* ===== Cell wrapper ===== */
.day-container {
  padding: 4px;
  position: relative;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}

/* ===== Day number ===== */
.date-label {
  font-size: 12px;
  color: #666;
  position: relative;
  z-index: 2;
}

/* ===== Guest rows (text only) ===== */
.guest {
  font-size: 11px;
  line-height: 1.1;
  color: #fff;
  position: relative;
  z-index: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== Reservation background layer (one per day) ===== */
.booking-layer {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  z-index: 0;
  pointer-events: none;
}

/* 1) fully booked (solid red) */
.booking-layer.bg-full {
  background: #e53935;
}

/* 2) start day (half white / half red) */
.booking-layer.bg-start {
  /* white triangle top-left, red bottom-right */
  background: linear-gradient(135deg, #ffffff 0 50%, #e53935 50% 100%);
}

/* 3) end day (half red / half white) */
.booking-layer.bg-end {
  /* white triangle top-right, red bottom-left */
  background: linear-gradient(225deg, #ffffff 0 50%, #e53935 50% 100%);
}

/* 4) turnover day (end + start on same day) -> 4 triangles */
.booking-layer.bg-turnover {
  background: conic-gradient(
    from 45deg,
    #e53935 0 90deg,
    #ffffff 90deg 180deg,
    #e53935 180deg 270deg,
    #ffffff 270deg 360deg
  );
}

/* ===== Your selection styling (click-range preview) ===== */
.day-container.between {
  background: rgba(229, 57, 53, 0.3);
}

.day-container.start::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 50%, rgba(229, 57, 53, 0.6) 50%);
  border-radius: 6px;
  z-index: 1;
  pointer-events: none;
}

.day-container.end::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(315deg, transparent 50%, rgba(229, 57, 53, 0.6) 50%);
  border-radius: 6px;
  z-index: 1;
  pointer-events: none;
}
</style>
