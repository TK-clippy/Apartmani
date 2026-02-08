<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Header -->
        <div class="q-mb-md">
          <div class="text-h5 text-weight-bold">Pregled</div>
          <div class="text-body2 text-grey-7 q-mt-xs">
            Brzi pristup kalendaru, rezervacijama i današnjim promjenama.
          </div>
        </div>

        <!-- Primary actions -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center justify-between q-gutter-sm">
            <div>
              <div class="text-subtitle1 text-weight-medium">Kalendar zauzetosti</div>
              <div class="text-body2 text-grey-7 q-mt-xs">
                Pregled po apartmanu i mjesecu — check-in / checkout logika.
              </div>
            </div>

            <div class="row q-gutter-sm">
              <q-btn unelevated icon="calendar_month" label="Otvori kalendar" to="/calendar" />
              <q-btn outline icon="add" label="Nova rezervacija" to="/calendar" />
            </div>
          </q-card-section>
        </q-card>

        <!-- Dashboard tiles -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">Dolasci danas</div>
                  <div class="text-caption text-grey-7">Check-in</div>
                </div>
                <q-chip dense icon="login">0</q-chip>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                Nema dolazaka za danas.
                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="calendar_month"
                    label="Pogledaj u kalendaru"
                    to="/calendar"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">Odlasci danas</div>
                  <div class="text-caption text-grey-7">Checkout</div>
                </div>
                <q-chip dense icon="logout">0</q-chip>
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                Nema odlazaka za danas.
                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="calendar_month"
                    label="Pogledaj u kalendaru"
                    to="/calendar"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">Slobodno ovaj tjedan</div>
                  <div class="text-caption text-grey-7">brzi uvid</div>
                </div>
                <q-icon name="query_stats" size="sm" class="text-grey-7" />
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                Odaberi apartman i provjeri slobodne dane u kalendaru.
                <div class="q-mt-sm">
                  <q-btn flat dense icon="search" label="Provjeri dostupnost" to="/calendar" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section class="row items-start justify-between">
                <div>
                  <div class="text-subtitle1 text-weight-medium">Apartmani</div>
                  <div class="text-caption text-grey-7">pregled i postavke</div>
                </div>
                <q-icon name="apartment" size="sm" class="text-grey-7" />
              </q-card-section>

              <q-separator />

              <q-card-section class="text-body2 text-grey-7">
                Pregled liste apartmana i osnovnih informacija.
                <div class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    icon="chevron_right"
                    label="Otvori apartmane"
                    to="/apartments"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Quick search -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium">Brza pretraga</div>
            <div class="text-body2 text-grey-7 q-mt-xs">
              Pronađi gosta ili rezervaciju po imenu / kontaktu. (UI spreman, spajamo kasnije)
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12 col-md">
                <q-input outlined dense placeholder="Upiši ime gosta…" v-model="search" clearable>
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-auto">
                <q-btn
                  :disable="!search"
                  unelevated
                  icon="search"
                  label="Traži"
                  @click="onSearch"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Recent activity (placeholder) -->
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-medium">Zadnje aktivnosti</div>
              <div class="text-caption text-grey-7">zadnje dodane ili izmijenjene rezervacije</div>
            </div>
            <q-btn flat dense icon="refresh" label="Osvježi" @click="onRefresh" />
          </q-card-section>

          <q-separator />

          <q-card-section class="text-body2 text-grey-7">
            Još nema aktivnosti za prikaz.
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')

function onSearch() {
  $q.notify({ message: `Pretraga: "${search.value}" (spajamo na backend)` })
}

function onRefresh() {
  $q.notify({ message: 'Osvježeno (placeholder)' })
}
</script>
