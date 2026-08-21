import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isUser = computed(() => currentUser.value?.role === 'user')
  const userName = computed(() => currentUser.value?.name || '')
  const userRole = computed(() => currentUser.value?.role || '')

  // 模拟用户数据
  const mockUsers = [
    { id: 1, username: 'admin', password: '123456', name: '系统管理员', role: 'admin', avatar: '', phone: '138****0001' },
    { id: 2, username: 'user', password: '123456', name: '张三', role: 'user', avatar: '', phone: '139****1234' },
    { id: 3, username: 'lisi', password: '123456', name: '李四', role: 'user', avatar: '', phone: '137****5678' },
  ]

  // 登录
  const login = (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password)
    if (user) {
      const fakeToken = 'token_' + Date.now() + '_' + user.id
      currentUser.value = { ...user, password: undefined }
      token.value = fakeToken
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('userInfo', JSON.stringify({ ...user, password: undefined }))
      return { success: true, user: currentUser.value }
    }
    return { success: false, message: '用户名或密码错误' }
  }

  // 退出登录
  const logout = () => {
    currentUser.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 初始化（从本地存储恢复）
  const initUser = () => {
    const savedUser = localStorage.getItem('userInfo')
    if (savedUser && token.value) {
      try {
        currentUser.value = JSON.parse(savedUser)
      } catch {
        logout()
      }
    }
  }

  // 更新用户信息
  const updateProfile = (data) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...data }
      localStorage.setItem('userInfo', JSON.stringify(currentUser.value))
    }
  }

  // 检查是否有某个权限
  const hasPermission = (permission) => {
    if (!currentUser.value) return false
    if (currentUser.value.role === 'admin') return true
    const userPermissions = ['view', 'borrow', 'return']
    return userPermissions.includes(permission)
  }

  return {
    currentUser, token, isLoggedIn, isAdmin, isUser, userName, userRole,
    login, logout, initUser, updateProfile, hasPermission
  }
})
