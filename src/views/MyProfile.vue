<template>
  <div class="my-profile-page">
    <div class="page-header"><h1>个人信息</h1></div>

    <div class="profile-grid">
      <div class="profile-card main-info">
        <div class="profile-header">
          <div class="profile-avatar" :class="{ admin: userStore.isAdmin }">
            {{ userStore.userName.charAt(0) }}
          </div>
          <div class="profile-name">
            <h2>{{ userStore.userName }}</h2>
            <span class="role-badge" :class="userStore.isAdmin ? 'admin' : 'user'">
              {{ userStore.isAdmin ? '系统管理员' : '普通读者' }}
            </span>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat-item"><span class="value">{{ borrowCount }}</span><span class="label">累计借阅</span></div>
          <div class="stat-item"><span class="value">{{ currentBorrow }}</span><span class="label">在借图书</span></div>
          <div class="stat-item"><span class="value">{{ userStore.currentUser?.joinDate || '2024-01-01' }}</span><span class="label">注册日期</span></div>
        </div>
      </div>

      <div class="profile-card edit-card">
        <div class="card-header"><h3>修改信息</h3></div>
        <el-form :model="formData" label-width="80px" class="profile-form">
          <el-form-item label="姓名"><el-input v-model="formData.name" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="formData.phone" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="formData.email" /></el-form-item>
          <el-form-item><el-button type="primary" @click="saveProfile">保存修改</el-button></el-form-item>
        </el-form>
      </div>

      <div class="profile-card password-card">
        <div class="card-header"><h3>修改密码</h3></div>
        <el-form :model="pwdForm" label-width="100px" class="profile-form">
          <el-form-item label="当前密码"><el-input v-model="pwdForm.oldPassword" type="password" show-password /></el-form-item>
          <el-form-item label="新密码"><el-input v-model="pwdForm.newPassword" type="password" show-password /></el-form-item>
          <el-form-item label="确认密码"><el-input v-model="pwdForm.confirmPassword" type="password" show-password /></el-form-item>
          <el-form-item><el-button type="primary" @click="changePassword">修改密码</el-button></el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useLibraryStore } from '@/stores'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import './MyProfile.scss'

const store = useLibraryStore()
const userStore = useUserStore()

const formData = reactive({
  name: userStore.userName,
  phone: userStore.currentUser?.phone || '',
  email: userStore.currentUser?.email || ''
})

const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const borrowCount = computed(() => {
  return store.borrowRecords.filter(r => r.readerName === userStore.userName).length
})

const currentBorrow = computed(() => {
  return store.borrowRecords.filter(r => r.readerName === userStore.userName && r.status === '借阅中').length
})

const saveProfile = () => {
  userStore.updateProfile({ name: formData.name, phone: formData.phone, email: formData.email })
  ElMessage.success('信息保存成功')
}

const changePassword = () => {
  if (!pwdForm.oldPassword || !pwdForm.newPassword) {
    ElMessage.warning('请填写完整')
    return
  }
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  Object.assign(pwdForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
}
</script>
