export default {
  /* ============================
      GLOBAL / SHARED (više stranica)
     ============================ */

  edit: 'Uredi',
  delete: 'Obriši',

  nav: {
    home: 'Početna',
    calendar: 'Kalendar',
    apartments: 'Apartmani'
  },

  failedToLoadData: 'Učitavanje podataka nije uspjelo.',
  failedToSaveReservation: 'Spremanje rezervacije nije uspjelo.',
  failedToUpdateReservation: 'Ažuriranje rezervacije nije uspjelo.',
  reservationDeleted: 'Rezervacija obrisana.',
  failedToDeleteReservation: 'Brisanje rezervacije nije uspjelo.',

  months: {
    // koristi se u ApartmentsCalendar.vue
    january: 'Siječanj',
    february: 'Veljača',
    march: 'Ožujak',
    april: 'Travanj',
    may: 'Svibanj',
    june: 'Lipanj',
    july: 'Srpanj',
    august: 'Kolovoz',
    september: 'Rujan',
    october: 'Listopad',
    november: 'Studeni',
    december: 'Prosinac',
  },

  /* ============================
      ApartmentsCalendar.vue
     ============================ */

  selectApartment: 'Odaberi apartman',
  calendarReservations: 'Kalendar rezervacija',

  dateRange: 'Datumi',
  guests: 'Gosti',
  notes: 'Napomena',

  tooManyGuests:
    'Previše gostiju ({count}). Kapacitet apartmana je {capacity}.',

  newReservation: 'Nova rezervacija',
  reservationPeriod: 'Razdoblje',

  guestName: 'Ime gosta',
  guestsCount: 'Broj gostiju',
  note: 'Napomena',

  cancel: 'Odustani',
  save: 'Spremi',

  deleteApartmentTitle: 'Brisanje apartmana',
  deleteApartmentConfirm: 'Želiš li obrisati ovaj apartman?',
  deleted: 'Obrisano',

  editApartment: 'Uredi apartman',
  updated: 'Ažurirano',


  /* ============================
      Dashboard (Index / Dashboard page)
     ============================ */

  dashboardTitle: 'Pregled',
  dashboardSubtitle:
    'Brzi pristup kalendaru, rezervacijama i današnjim promjenama.',

  occupancyCalendar: 'Kalendar zauzetosti',
  occupancyCalendarHint:
    'Pregled po apartmanu i mjesecu — check-in / checkout logika.',
  openCalendar: 'Otvori kalendar',

  arrivalsToday: 'Dolasci danas',
  departuresToday: 'Odlasci danas',
  checkIn: 'Check-in',
  checkOut: 'Checkout',
  noArrivalsToday: 'Nema dolazaka za danas.',
  noDeparturesToday: 'Nema odlazaka za danas.',
  viewInCalendar: 'Pogledaj u kalendaru',

  next7Days: 'Sljedećih 7 dana',
  quickInsight: 'brzi uvid',
  arrivals: 'Dolasci',
  departures: 'Odlasci',
  checkAvailability: 'Provjeri dostupnost',

  apartmentsTitle: 'Apartmani',
  overviewAndSettings: 'pregled i postavke',
  totalApartments: 'Ukupno apartmana',
  openApartments: 'Otvori apartmane',

  recentActivity: 'Zadnje aktivnosti',
  recentActivityHint:
    'zadnje dodane ili izmijenjene rezervacije',
  noActivity: 'Još nema aktivnosti za prikaz.',
  refresh: 'Osvježi',

  /* ============================
      ApartmentsPage.vue
     ============================ */

  apartments: 'Apartmani',
  apartmentsHint: 'Popis apartmana i osnovni detalji.',
  addApartment: 'Dodaj apartman',
  apartmentDetails: 'Detalji apartmana',
  noApartments: 'Nema apartmana.',
  search: 'Pretraži…',
  name: 'Naziv',
  capacity: 'Kapacitet',
  createdAt: 'Kreirano',
  loginRequired: 'Potrebna je prijava (auth-first).',
}
