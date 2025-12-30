const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'calendar', component: () => import('pages/CalendarPage.vue') },
      { path: 'apartments', component: () => import('pages/ApartmentsPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it if you handle 404s in your app
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
