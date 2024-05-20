import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginMenu from '../views/Auth/LoginMenu.vue';
import RegisterMenu from '../views/Auth/RegisterMenu.vue';
import DashboardView from '../views/DashboardView.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginMenu },
  { path: '/register', name: 'register', component: RegisterMenu },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next({ name: 'login' });
    } else {
      next();
    }
  });
});

export default router;
