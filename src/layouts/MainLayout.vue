<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" stroke-width="2"/>
            <path d="M12 28V12L20 16L28 12V28L20 24L12 28Z" fill="url(#logoGrad)"/>
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="logo-text">灵境书阁</span>
        </transition>
      </div>

      <div class="role-badge" v-if="!isCollapsed">
        <span class="badge" :class="userStore.isAdmin ? 'admin' : 'user'">
          {{ userStore.isAdmin ? '管理员' : '读者' }}
        </span>
      </div>

      <nav class="nav-menu">
        <router-link v-for="item in visibleMenuItems" :key="item.path" :to="item.path" class="nav-item" :class="{ active: currentRoute === item.path }">
          <el-icon class="nav-icon"><component :is="item.icon" /></el-icon>
          <transition name="fade">
            <span v-if="!isCollapsed" class="nav-text">{{ item.title }}</span>
          </transition>
          <div class="nav-indicator"></div>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-avatar" :class="{ admin: userStore.isAdmin }">
          <span class="avatar-text">{{ userStore.userName.charAt(0) }}</span>
        </div>
        <transition name="fade">
          <div v-if="!isCollapsed" class="user-info">
            <span class="user-name">{{ userStore.userName }}</span>
            <span class="user-role">{{ userStore.isAdmin ? '系统管理员' : '普通读者' }}</span>
          </div>
        </transition>
        <transition name="fade">
          <el-button v-if="!isCollapsed" circle class="logout-btn" @click="handleLogout" title="退出登录">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
        </transition>
      </div>
    </aside>

    <main class="main-content" :class="{ expanded: isCollapsed }">
      <header class="top-header">
        <div class="header-left">
          <el-button class="collapse-btn" @click="toggleCollapse" text>
            <el-icon size="20"><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
          </el-button>
          <div class="search-box">
            <el-icon class="search-icon"><Search /></el-icon>
            <input type="text" placeholder="搜索图书、读者..." v-model="searchQuery" />
          </div>
        </div>
        <div class="header-right">
          <el-badge :value="notifications" :hidden="notifications === 0" class="notification-badge">
            <el-button circle class="header-btn"><el-icon><Bell /></el-icon></el-button>
          </el-badge>
          <el-button circle class="header-btn" v-if="userStore.isAdmin"><el-icon><Setting /></el-icon></el-button>
          <div class="header-time">
            <span class="time">{{ currentTime }}</span>
            <span class="date">{{ currentDate }}</span>
          </div>
        </div>
      </header>
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import './MainLayout.scss'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isCollapsed = ref(false)
const searchQuery = ref('')
const notifications = ref(3)
const currentTime = ref('')
const currentDate = ref('')

// 管理员菜单
const adminMenuItems = [
  { path: '/', title: '控制台', icon: 'Odometer', roles: ['admin'] },
  { path: '/books', title: '图书管理', icon: 'Collection', roles: ['admin'] },
  { path: '/readers', title: '读者管理', icon: 'User', roles: ['admin'] },
  { path: '/borrow', title: '借阅管理', icon: 'Document', roles: ['admin'] },
  { path: '/statistics', title: '数据统计', icon: 'DataAnalysis', roles: ['admin'] },
  { path: '/categories', title: '分类管理', icon: 'Files', roles: ['admin'] },
]

// 读者菜单
const userMenuItems = [
  { path: '/', title: '首页', icon: 'HomeFilled', roles: ['user'] },
  { path: '/books', title: '图书浏览', icon: 'Collection', roles: ['user'] },
  { path: '/my-borrow', title: '我的借阅', icon: 'Document', roles: ['user'] },
  { path: '/my-profile', title: '个人信息', icon: 'User', roles: ['user'] },
]

const allMenuItems = [...adminMenuItems, ...userMenuItems]

const visibleMenuItems = computed(() => {
  return allMenuItems.filter(item => item.roles.includes(userStore.userRole))
})

const currentRoute = computed(() => route.path)

const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录？', '提示', { type: 'warning' }).then(() => {
    userStore.logout()
    router.push('/login')
  }).catch(() => {})
}

let timeInterval
onMounted(() => {
  userStore.initUser()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})
onUnmounted(() => { clearInterval(timeInterval) })
</script>
