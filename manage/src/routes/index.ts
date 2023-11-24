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
      component: () => import('../views/menu/normal.vue'),
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: () => import('../views/sidebar/index.vue'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/legend',
      name: 'legend',
      component: () => import('../views/legend/index.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/overlay/index.vue'),
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
