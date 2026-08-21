<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="34" stroke="url(#loginGrad)" stroke-width="2"/>
            <path d="M22 52V20L36 28L50 20V52L36 44L22 52Z" fill="url(#loginGrad)"/>
            <defs><linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
          </svg>
        </div>
        <h1 class="login-title">灵境书阁</h1>
        <p class="login-subtitle">智能图书馆管理系统</p>
      </div>

      <div class="role-tabs">
        <div class="role-tab" :class="{ active: loginRole === 'admin' }" @click="loginRole = 'admin'">
          <el-icon><Setting /></el-icon>
          <span>管理员登录</span>
        </div>
        <div class="role-tab" :class="{ active: loginRole === 'user' }" @click="loginRole = 'user'">
          <el-icon><User /></el-icon>
          <span>读者登录</span>
        </div>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-field">
          <input type="text" v-model="username" :placeholder="loginRole === 'admin' ? '管理员账号' : '读者账号'" autocomplete="username" />
          <el-icon class="field-icon"><User /></el-icon>
        </div>
        <div class="form-field">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="请输入密码" autocomplete="current-password" />
          <el-icon class="field-icon"><Lock /></el-icon>
          <el-icon class="toggle-pwd" @click="showPassword = !showPassword"><View v-if="!showPassword" /><Hide v-else /></el-icon>
        </div>
        <div class="remember-row">
          <label class="remember-label"><input type="checkbox" v-model="remember" /> 记住我</label>
        </div>
        <button type="submit" class="login-btn" :class="{ admin: loginRole === 'admin' }">
          {{ loginRole === 'admin' ? '管理员登录' : '读者登录' }}
        </button>
      </form>

      <div class="login-footer">
        <div class="test-accounts">
          <p class="test-title">测试账号</p>
          <div class="account-list">
            <div class="account-item" @click="fillAccount('admin', '123456')">
              <span class="badge admin">管理</span>
              <span>admin / 123456</span>
            </div>
            <div class="account-item" @click="fillAccount('user', '123456')">
              <span class="badge user">读者</span>
              <span>user / 123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import './Login.scss'

const router = useRouter()
const userStore = useUserStore()

const loginRole = ref('admin')
const username = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const fillAccount = (user, pwd) => {
  username.value = user
  password.value = pwd
  loginRole.value = user === 'admin' ? 'admin' : 'user'
}

const handleLogin = () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  const result = userStore.login(username.value, password.value)
  if (result.success) {
    // 检查角色是否匹配选择
    if (loginRole.value === 'admin' && result.user.role !== 'admin') {
      ElMessage.error('该账号不是管理员，请选择读者登录')
      userStore.logout()
      return
    }
    if (loginRole.value === 'user' && result.user.role === 'admin') {
      ElMessage.error('管理员账号请选择管理员登录')
      userStore.logout()
      return
    }
    ElMessage.success(`欢迎回来，${result.user.name}`)
    router.push('/')
  } else {
    ElMessage.error(result.message)
  }
}
</script>
