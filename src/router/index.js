import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginMenu from '../views/Auth/LoginMenu.vue'
import RegisterMenu from '../views/Auth/RegisterMenu.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginMenu
  },
 
  {
    path: '/Register',
    name: 'Register',
    component: RegisterMenu
  }
 
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
