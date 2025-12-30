<template>
  <q-dialog v-model="dialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Nova rezervacija</div>
        <div class="text-caption text-grey">{{ start }} → {{ end }}</div>
      </q-card-section>

      <q-card-section class="q-gutter-sm">
        <q-input v-model="guestName" label="Ime gosta" dense autofocus />

        <q-input v-model.number="persons" type="number" label="Broj gostiju" dense min="1" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Odustani" @click="close" />
        <q-btn color="primary" label="Spremi" :disable="!guestName" @click="save" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

/**
 * PROPS
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

/**
 * v-model proxy (OBAVEZNO ovako)
 */
const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

/**
 * FORM STATE
 */
const guestName = ref('')
const persons = ref(1)

/**
 * ACTIONS
 */
function close() {
  dialog.value = false
}

function save() {
  emit('save', {
    guestName: guestName.value,
    persons: persons.value,
    start: props.start,
    end: props.end,
  })

  dialog.value = false
  guestName.value = ''
  persons.value = 1
}
</script>
