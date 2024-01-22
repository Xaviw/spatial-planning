import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
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
  const accessToken = localStorage.getItem('access_token')
  // 未登录且前往需要登录的页面：重定向到登录页
  if (!to.meta.noNeedLogin && !accessToken) {
    return { name: 'login', replace: true }
  }
  if (accessToken && to.name === 'login') {
    // 已登录前往登录页，且来自于登录页面或404页面：跳转首页
    if (
      typeof from.name === 'string' &&
      ['login', 'notFound'].includes(from.name)
    ) {
      return { name: 'config', replace: true }
    }
    // 已登录前往登录页：取消跳转
    return false
  }
})

export default router
