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
      path: '/config',
      name: 'config',
      component: () => import('../views/config/index.vue'),
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/menu/index.vue'),
    },
    {
      path: '/sider',
      name: 'sider',
      component: () => import('../views/sider/index.vue'),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/map/index.vue'),
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
