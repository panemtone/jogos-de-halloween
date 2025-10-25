import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Profecia from '@/views/Profecia.vue'
import Entrada from '@/views/Entrada.vue'
import OutroLado from '@/views/OutroLado.vue'
import Galeria from '@/views/Galeria.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profecia',
      name: 'profecia',
      component: Profecia,
    },
    {
      path: '/entrada',
      name: 'entrada',
      component: Entrada,
    },
    {
      path: '/outrolado',
      name: 'outrolado',
      component: OutroLado,
    },
    {
      path: '/galeria',
      name: 'galeria',
      component: Galeria,
    },
  ],
})

export default router
