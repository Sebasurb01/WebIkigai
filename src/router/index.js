import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginMenu from '../views/Auth/LoginMenu.vue'
import RegisterMenu from '../views/Auth/RegisterMenu.vue'
import DashboardView from '@/views/DashboardView.vue'
import { auth } from '@/firebase/init' 

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginMenu
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterMenu
  },
  {
    path: '/dashboard',
    name: 'dashboarduser',
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    const user = auth.currentUser;
    if (user) {
      next();
    } else {
      next({
        name: 'login'
      });
    }
  } else {
    next();
  }
})

export default router