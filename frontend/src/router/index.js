import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: HomeView,
      meta: { isAuth: true },
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

router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    if (!localStorage.getItem("token") && !useUserStore().token) {
      ElMessage.error("您还未登录，请登录后重试！")
      return next("/login");
    }
  }

  next();
})

export default router
