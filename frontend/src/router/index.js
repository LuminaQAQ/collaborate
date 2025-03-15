import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import AuthView from '@/views/AuthView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: HomeView,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import("@/views/Home/ClDashboard.vue")
        },
        {
          path: 'collections',
          name: 'Collections',
          component: () => import("@/views/Home/ClCollections.vue")
        },
        {
          path: 'notes',
          name: 'Notes',
          component: () => import("@/views/Home/ClNotes.vue")
        },
        {
          path: 'books',
          name: 'Books',
          component: () => import("@/views/Home/ClBooks.vue")
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
  ],
})

export default router
