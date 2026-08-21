import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '控制台', icon: 'Odometer', roles: ['admin'] }
      },
      {
        path: '',
        name: 'UserHome',
        component: () => import('@/views/UserHome.vue'),
        meta: { title: '首页', icon: 'HomeFilled', roles: ['user'] }
      },
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/views/Books.vue'),
        meta: { title: '图书管理', icon: 'Collection', roles: ['admin', 'user'] }
      },
      {
        path: 'readers',
        name: 'Readers',
        component: () => import('@/views/Readers.vue'),
        meta: { title: '读者管理', icon: 'User', roles: ['admin'] }
      },
      {
        path: 'borrow',
        name: 'Borrow',
        component: () => import('@/views/Borrow.vue'),
        meta: { title: '借阅管理', icon: 'Document', roles: ['admin'] }
      },
      {
        path: 'my-borrow',
        name: 'MyBorrow',
        component: () => import('@/views/MyBorrow.vue'),
        meta: { title: '我的借阅', icon: 'Document', roles: ['user'] }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/Statistics.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis', roles: ['admin'] }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Categories.vue'),
        meta: { title: '分类管理', icon: 'Files', roles: ['admin'] }
      },
      {
        path: 'my-profile',
        name: 'MyProfile',
        component: () => import('@/views/MyProfile.vue'),
        meta: { title: '个人信息', icon: 'User', roles: ['user'] }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - 灵境书阁`
  
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
