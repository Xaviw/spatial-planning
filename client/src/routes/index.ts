import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/:id?',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})
