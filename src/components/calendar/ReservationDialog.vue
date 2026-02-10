<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="qa-card" style="min-width: 380px; max-width: 92vw">
      <!-- Header -->
      <q-card-section class="row items-start">
        <div>
          <div class="text-h6">
            {{ isEdit ? $t('editReservation') : $t('newReservation') }}
          </div>
          <div class="text-caption text-grey-6">{{ start }} → {{ end }}</div>
        </div>

        <q-space />

        <q-btn flat round icon="close" @click="close" />
      </q-card-section>

      <q-separator />

      <!-- Form -->
      <q-card-section class="q-gutter-sm">
        <q-input v-model="guestName" :label="$t('guestName')" dense autofocus :maxlength="80" />

        <q-input
          v-model.number="guestsCount"
          type="number"
          :label="$t('guestsCount')"
          dense
          min="1"
        />

        <q-input v-model="notes" type="textarea" autogrow dense :label="$t('notes')" />
      </q-card-section>

      <q-separator />

      <!-- Actions -->
      <q-card-actions align="between">
        <div class="row items-center q-gutter-sm">
          <q-btn flat :label="$t('cancel')" @click="close" />
          <q-btn
            unelevated
            color="primary"
            :label="$t('save')"
            :disable="!guestName"
            @click="onSave"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  start: { type: String, required: true }, // YYYY-MM-DD (inclusive)
  end: { type: String, required: true }, // YYYY-MM-DD (inclusive)

  // null => create mode, object => edit mode
  reservation: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.reservation?.id)

/**
 * FORM STATE
 */
const guestName = ref('')
const guestsCount = ref(1)
const notes = ref('')

function hydrateFromReservation() {
  if (props.reservation) {
    guestName.value = props.reservation.guestName ?? ''
    guestsCount.value = props.reservation.guestsCount ?? 1
    notes.value = props.reservation.notes ?? ''
  } else {
    guestName.value = ''
    guestsCount.value = 1
    notes.value = ''
  }
}

/** when dialog opens, fill form */
watch(
  () => props.modelValue,
  (open) => {
    if (open) hydrateFromReservation()
  },
)

/** if reservation changes while dialog open */
watch(
  () => props.reservation,
  () => {
    if (dialog.value) hydrateFromReservation()
  },
)

function close() {
  dialog.value = false
}

function onSave() {
  emit('save', {
    id: props.reservation?.id ?? null,
    guestName: guestName.value.trim(),
    guestsCount: guestsCount.value,
    notes: notes.value?.trim() || null,
    start: props.start,
    end: props.end,
  })
  dialog.value = false
}
</script>
