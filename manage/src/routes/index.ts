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
      name: 'menu',
      component: () => import('../views/Menu/normal.vue'),
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: () => import('../views/sidebar.vue'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/legend',
      name: 'legend',
      component: () => import('../views/legend.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/map.vue'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/notFound.vue'),
    },
  ],
})
