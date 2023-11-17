import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      component: () => import('../views/login.vue'),
      meta: {
        layout: 'custom',
      },
    },
    {
      path: '/menu',
      component: () => import('../views/menu.vue'),
    },
    {
      path: '/sidebar',
      component: () => import('../views/sidebar.vue'),
    },
    {
      path: '/legend',
      component: () => import('../views/legend.vue'),
    },
    {
      path: '/map',
      component: () => import('../views/map.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/notFound.vue'),
    },
  ],
})
