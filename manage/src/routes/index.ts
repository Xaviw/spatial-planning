import { isString } from '@sp/shared/utils'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        layout: 'custom',
        noNeedLogin: true,
      },
    },
    {
      path: '/update',
      component: () => import('../views/updateInfo.vue'),
      meta: {
        layout: 'basic',
      },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/config/index.vue'),
      meta: {
        layout: 'basic',
      },
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/menu/index.vue'),
      meta: {
        layout: 'basic',
      },
    },
    {
      path: '/sider',
      name: 'sider',
      component: () => import('../views/sider/index.vue'),
      meta: {
        keepAlive: true,
        layout: 'basic',
      },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/map/index.vue'),
      meta: {
        keepAlive: true,
        layout: 'basic',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/notFound.vue'),
      name: 'notFound',
      meta: {
        layout: 'custom',
        noNeedLogin: true,
      },
    },
  ],
})

router.beforeEach((to, from) => {
  // 根据token判断登录
  const accessToken = localStorage.getItem('Access-Token')
  // 未登录且前往需要登录的页面：重定向到登录页
  if (!to.meta.noNeedLogin && !accessToken) {
    return { name: 'login', replace: true }
  }
  if (accessToken && to.name === 'login') {
    // 已登录前往登录页，且来自于登录页面或404页面：跳转首页
    if (isString(from.name) && ['login', 'notFound'].includes(from.name)) {
      return { name: 'home', replace: true }
    }
    // 已登录前往登录页：取消跳转
    return false
  }
})

export default router
