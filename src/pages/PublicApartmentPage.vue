<template>
  <q-page>
    <!-- HERO -->
    <div class="hero">
      <q-img :src="apartment.heroUrl" class="hero__img" :ratio="16/9">
        <div class="hero__overlay" />
        <div class="hero__content q-pa-md">
          <div class="text-h4 text-weight-bold text-white">{{ apartment.name }}</div>
          <div class="text-body2 text-white q-mt-xs">
            {{ apartment.location }} · {{ apartment.capacity }} osoba · {{ apartment.beds }} kreveta
          </div>
        </div>
      </q-img>
    </div>

    <div class="q-pa-md">
      <div class="row q-col-gutter-md">
        <!-- LEFT: info + availability -->
        <div class="col-12 col-md-7">
          <q-card bordered flat class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Opis</div>
              <div class="text-body2 text-grey-8 q-mt-sm">
                {{ apartment.description }}
              </div>

              <div class="row q-col-gutter-sm q-mt-md">
                <div class="col-auto" v-for="a in apartment.amenities" :key="a">
                  <q-chip dense outline>{{ a }}</q-chip>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card bordered flat>
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-subtitle1 text-weight-medium">Zauzeti termini</div>
                <div class="text-body2 text-grey-7 q-mt-xs">
                  Samo pregled — za rezervaciju pošalji upit desno.
                </div>
              </div>
              <q-badge outline color="negative">zauzeto</q-badge>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-date
                v-model="dummyModel"
                minimal
                :events="busyDates"
                event-color="negative"
                readonly
              />

              <div class="text-caption text-grey-7 q-mt-md">
                Označeni su zauzeti dani.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- RIGHT: contact form -->
        <div class="col-12 col-md-5">
          <q-card bordered flat>
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Upit za rezervaciju</div>
              <div class="text-body2 text-grey-7 q-mt-xs">
                Odgovaramo čim prije.
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-gutter-md">
              <q-input v-model="form.name" label="Ime i prezime" outlined dense />
              <q-input v-model="form.email" label="Email" type="email" outlined dense />
              <q-input v-model="form.phone" label="Telefon (opcionalno)" outlined dense />

              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-input v-model="form.arrival" label="Dolazak" outlined dense placeholder="YYYY/MM/DD" />
                </div>
                <div class="col-6">
                  <q-input v-model="form.departure" label="Odlazak" outlined dense placeholder="YYYY/MM/DD" />
                </div>
              </div>

              <q-input v-model.number="form.guests" label="Broj osoba" type="number" outlined dense />
              <q-input v-model="form.message" label="Poruka" type="textarea" outlined autogrow />

              <q-btn
                unelevated
                color="primary"
                class="full-width"
                label="Pošalji upit"
                :loading="sending"
                @click="submit"
              />
            </q-card-section>
          </q-card>

          <q-card bordered flat class="q-mt-md">
            <q-card-section class="text-body2 text-grey-8">
              <div class="text-weight-medium q-mb-xs">Napomena</div>
              Ovo je placeholder public page. Kasnije ćemo umjesto hardcoded podataka povlačiti:
              <div class="q-mt-sm">
                <code>GET /public/apartments/:id</code> i <code>GET /public/apartments/:id/bookings</code>.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="text-caption text-grey-7 q-mt-lg">
        Hero slike su s Unsplasha (free to use). :contentReference[oaicite:1]{index=1}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const route = useRoute()

/**
 * HERO slike (free to use, Unsplash):
 * 1) kuhinja/interior
 * 2) spavaća soba
 * 3) balkon/sea view
 */
const HERO_BY_APT_ID = {
  1: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&fm=jpg&q=60&w=2400',
  2: 'https://images.unsplash.com/photo-1760573776062-7d2a7baeb49d?auto=format&fit=crop&fm=jpg&q=60&w=2400',
  3: 'https://images.unsplash.com/photo-1673403731025-2f1ac0c042f5?auto=format&fit=crop&fm=jpg&q=60&w=2400'
}

const MOCK_APARTMENTS = [
  {
    id: 1,
    name: 'Apartman Aurora',
    location: 'Split',
    capacity: 4,
    beds: 2,
    description: 'Svijetao apartman u centru, idealan za parove i obitelji.',
    amenities: ['Wi-Fi', 'Klima', 'Kuhinja', 'Parking (na upit)']
  },
  {
    id: 2,
    name: 'Apartman Mare',
    location: 'Zadar',
    capacity: 3,
    beds: 2,
    description: 'Mirna lokacija, par minuta do plaže, super za digitalne nomade.',
    amenities: ['Wi-Fi', 'Klima', 'Balkon', 'Perilica']
  },
  {
    id: 3,
    name: 'Apartman Vista',
    location: 'Makarska',
    capacity: 6,
    beds: 3,
    description: 'Pogled na more, velika terasa i puno dnevnog svjetla.',
    amenities: ['Wi-Fi', 'Klima', 'Terasa', 'Roštilj']
  }
]

// ---- Apartment resolve
const apartmentId = computed(() => Number(route.params.apartmentId || 1))

const apartment = computed(() => {
  const found = MOCK_APARTMENTS.find(a => a.id === apartmentId.value) || MOCK_APARTMENTS[0]
  return {
    ...found,
    heroUrl: HERO_BY_APT_ID[found.id] || HERO_BY_APT_ID[1]
  }
})

// ---- Availability (placeholder bookings)
const MOCK_BOOKINGS_BY_APT = {
  1: [
    { from: '2026/02/15', to: '2026/02/18' },
    { from: '2026/03/02', to: '2026/03/06' }
  ],
  2: [{ from: '2026/02/20', to: '2026/02/22' }],
  3: [{ from: '2026/02/12', to: '2026/02/14' }, { from: '2026/03/10', to: '2026/03/15' }]
}

function expandRange(from, to) {
  const out = []
  let cur = from
  // uključimo sve dane od from do to (inclusive)
  while (cur <= to) {
    out.push(cur)
    cur = date.formatDate(date.addToDate(date.extractDate(cur, 'YYYY/MM/DD'), { days: 1 }), 'YYYY/MM/DD')
  }
  return out
}

const busyDates = computed(() => {
  const ranges = MOCK_BOOKINGS_BY_APT[apartmentId.value] || []
  const days = new Set()
  for (const r of ranges) {
    for (const d of expandRange(r.from, r.to)) days.add(d)
  }
  return Array.from(days)
})

// QDate treba v-model (ali nama je read-only)
const dummyModel = ref(date.formatDate(new Date(), 'YYYY/MM/DD'))

// ---- Contact form
const form = reactive({
  name: '',
  email: '',
  phone: '',
  arrival: '',
  departure: '',
  guests: 2,
  message: ''
})

const sending = ref(false)

async function submit() {
  if (!form.name || !form.email) {
    $q.notify({ type: 'negative', message: 'Ime i email su obavezni.' })
    return
  }

  sending.value = true
  try {
    // TODO: zamijeni sa stvarnim endpointom
    // await api.post('/public/inquiries', { apartmentId: apartmentId.value, ...form })
    await new Promise(r => setTimeout(r, 450))

    $q.notify({ type: 'positive', message: 'Upit poslan! Javimo se uskoro.' })
    form.message = ''
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Greška pri slanju upita.' })
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.hero__img {
  border-radius: 0;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.55));
}
.hero__content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
