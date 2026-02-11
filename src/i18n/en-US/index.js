export default {
  /* ============================
     GLOBAL / SHARED (used across pages)
     ============================ */

  edit: 'Edit',
  delete: 'Delete',

  failedToLoadData: 'Failed to load data.',
  failedToSaveReservation: 'Failed to save reservation.',
  failedToUpdateReservation: 'Failed to update reservation.',
  reservationDeleted: 'Reservation deleted.',
  failedToDeleteReservation: 'Failed to delete reservation.',

  months: {
    // Used in ApartmentsCalendar.vue
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },

  /* ============================
     ApartmentsCalendar.vue
     ============================ */

  selectApartment: 'Select apartment',
  calendarReservations: 'Reservation calendar',

  dateRange: 'Dates',
  guests: 'Guests',
  notes: 'Notes',

  tooManyGuests:
    'Too many guests ({count}). Apartment capacity is {capacity}.',

  /* ============================
     Dashboard (Index / Dashboard page)
     ============================ */

  dashboardTitle: 'Overview',
  dashboardSubtitle:
    'Quick access to calendar, reservations and today’s changes.',

  occupancyCalendar: 'Occupancy calendar',
  occupancyCalendarHint:
    'Monthly overview per apartment — check-in / checkout logic.',
  openCalendar: 'Open calendar',

  arrivalsToday: 'Arrivals today',
  departuresToday: 'Departures today',
  checkIn: 'Check-in',
  checkOut: 'Checkout',
  noArrivalsToday: 'No arrivals today.',
  noDeparturesToday: 'No departures today.',
  viewInCalendar: 'View in calendar',

  next7Days: 'Next 7 days',
  quickInsight: 'quick insight',
  arrivals: 'Arrivals',
  departures: 'Departures',
  checkAvailability: 'Check availability',

  apartmentsTitle: 'Apartments',
  overviewAndSettings: 'overview and settings',
  totalApartments: 'Total apartments',
  openApartments: 'Open apartments',

  recentActivity: 'Recent activity',
  recentActivityHint:
    'Recently added or modified reservations',
  noActivity: 'No recent activity yet.',
  refresh: 'Refresh',

  /* ============================
     ApartmentsPage.vue
     ============================ */

  apartments: 'Apartments',
  apartmentsHint: 'List of apartments and basic details.',
  addApartment: 'Add apartment',
  apartmentDetails: 'Apartment details',
  noApartments: 'No apartments found.',
  search: 'Search…',
  name: 'Name',
  capacity: 'Capacity',
  createdAt: 'Created',
  loginRequired: 'Login required (auth-first).',
}
