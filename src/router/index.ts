import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Graph from '@/pages/Graph.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/graph',
      component: Graph
    }
  ]
})

export default router