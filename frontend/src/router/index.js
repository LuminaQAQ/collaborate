import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: HomeView,
      meta: { isAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Home/DashboardView.vue'),
        },
        {
          path: 'favorites',
          name: 'FavoritesView',
          component: () => import('@/views/Home/FavoritesView/FavoritesView.vue'),
        },
        {
          path: 'notes',
          name: 'Notes',
          component: () => import('@/views/Home/ClNotes.vue'),
        },
        {
          path: 'books',
          name: 'Books',
          component: () => import('@/views/Home/ClBooks.vue'),
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/Home/ClSettings.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/user/:user',
      name: 'PersonalCenter',
      meta: { isAuth: true },
      component: () => import('@/views/User/PersonalView.vue'),
    },
    {
      path: '/:user/:book',
      meta: { isAuth: true },
      component: () => import('@/components/layout/BookContainer.vue'),
      children: [
        {
          path: '',
          name: 'Book',
          component: () => import('@/views/Doc/BookView.vue'),
        },
        {
          path: ':doc',
          name: 'Doc',
          component: () => import('@/views/Doc/DocView.vue'),
        },
      ],
    },
    {
      path: '/g',
      children: [
        {
          path: 'share',
          name: 'Share',
          component: () => import('@/views/GlobalView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    if (!localStorage.getItem('token') && !useUserStore().token) {
      ElMessage.error('您还未登录，请登录后重试！')
      return next('/login')
    }
  }

  next()
})

export default router
