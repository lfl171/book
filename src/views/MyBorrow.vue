<template>
  <div class="my-borrow-page">
    <div class="page-header">
      <h1>我的借阅</h1>
    </div>

    <div class="borrow-stats">
      <div class="stat-card borrowing">
        <div class="stat-icon"><el-icon><Document /></el-icon></div>
        <div class="stat-info"><span class="stat-value">{{ borrowingCount }}</span><span class="stat-label">借阅中</span></div>
      </div>
      <div class="stat-card returned">
        <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
        <div class="stat-info"><span class="stat-value">{{ returnedCount }}</span><span class="stat-label">已归还</span></div>
      </div>
      <div class="stat-card overdue">
        <div class="stat-icon"><el-icon><WarningFilled /></el-icon></div>
        <div class="stat-info"><span class="stat-value">{{ overdueCount }}</span><span class="stat-label">逾期</span></div>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="filterStatus" placeholder="借阅状态" clearable style="width:160px">
        <el-option label="借阅中" value="借阅中" /><el-option label="已归还" value="已归还" /><el-option label="逾期" value="逾期" />
      </el-select>
    </div>

    <div class="records-list">
      <div class="record-card" v-for="record in filteredRecords" :key="record.id">
        <div class="record-cover"><el-icon><Notebook /></el-icon></div>
        <div class="record-info">
          <div class="record-title">{{ record.bookTitle }}</div>
          <div class="record-dates">
            <span>借阅: {{ record.borrowDate }}</span>
            <span>应还: {{ record.dueDate }}</span>
            <span v-if="record.returnDate">归还: {{ record.returnDate }}</span>
          </div>
        </div>
        <div class="record-status">
          <span class="status-tag" :class="getStatusClass(record)">{{ record.status }}</span>
          <span v-if="record.status !== '已归还'" class="days-text" :class="getDaysClass(record)">{{ getDaysText(record) }}</span>
        </div>
        <div class="record-actions">
          <el-button v-if="record.status === '借阅中' || record.status === '逾期'" type="primary" size="small" @click="returnBook(record)">归还</el-button>
          <el-button v-if="record.status === '借阅中' && record.renewCount < 2" type="warning" size="small" @click="renewBook(record)">续借</el-button>
        </div>
      </div>
      <el-empty v-if="filteredRecords.length === 0" description="暂无借阅记录" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import './MyBorrow.scss'

const store = useLibraryStore()
const userStore = useUserStore()
const filterStatus = ref('')

const myRecords = computed(() => {
  return store.borrowRecords.filter(r => r.readerName === userStore.userName)
})

const borrowingCount = computed(() => myRecords.value.filter(r => r.status === '借阅中').length)
const returnedCount = computed(() => myRecords.value.filter(r => r.status === '已归还').length)
const overdueCount = computed(() => myRecords.value.filter(r => r.status === '逾期').length)

const filteredRecords = computed(() => {
  if (!filterStatus.value) return myRecords.value
  return myRecords.value.filter(r => r.status === filterStatus.value)
})

const getStatusClass = (record) => {
  const map = { '借阅中': 'borrowing', '已归还': 'returned', '逾期': 'overdue' }
  return map[record.status] || ''
}

const getDaysClass = (record) => {
  const days = Math.ceil((new Date(record.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'danger'
  if (days < 7) return 'warning'
  return 'normal'
}

const getDaysText = (record) => {
  const days = Math.ceil((new Date(record.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return `逾期${Math.abs(days)}天`
  return `剩余${days}天`
}

const returnBook = (record) => {
  if (store.returnBook(record.id)) ElMessage.success('归还成功')
}

const renewBook = (record) => {
  const due = new Date(record.dueDate)
  due.setDate(due.getDate() + 30)
  record.dueDate = due.toISOString().split('T')[0]
  record.renewCount++
  ElMessage.success('续借成功')
}
</script>
