import { createRouter, createWebHistory } from "vue-router";

import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Settings from "../pages/Settings.vue";
import Graph from "../pages/Graph.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/graph',
      component: Graph
    },
    {
      path: '/settings',
      component: Settings
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

export default router