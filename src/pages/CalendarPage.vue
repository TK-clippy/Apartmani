<template>
  <q-page padding>
    <h5>{{ $t('calendarReservations') }}</h5>

    <ApartmentCalendar />
  </q-page>
</template>

<script setup>
import ApartmentCalendar from 'src/components/calendar/ApartmentCalendar.vue'
</script>
