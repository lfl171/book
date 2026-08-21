<template>
  <div class="readers-page">
    <div class="page-header">
      <h1>读者管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true"><el-icon><Plus /></el-icon>添加读者</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-item"><el-input v-model="searchText" placeholder="搜索姓名、手机号..." clearable prefix-icon="Search" /></div>
      <div class="filter-item"><el-select v-model="filterType" placeholder="读者类型" clearable style="width:100%">
        <el-option label="普通读者" value="普通读者" /><el-option label="VIP读者" value="VIP读者" /><el-option label="学生读者" value="学生读者" /><el-option label="教师读者" value="教师读者" />
      </el-select></div>
      <div class="filter-item"><el-select v-model="filterStatus" placeholder="状态" clearable style="width:100%">
        <el-option label="正常" value="正常" /><el-option label="冻结" value="冻结" />
      </el-select></div>
    </div>

    <div class="readers-table-wrap">
      <el-table :data="filteredReaders" style="width: 100%" row-class-name="table-row">
        <el-table-column label="读者信息" min-width="200">
          <template #default="{ row }">
            <div class="reader-name-cell">
              <div class="reader-avatar" :style="{ background: getAvatarColor(row.id) }">{{ row.name.charAt(0) }}</div>
              <div class="reader-info"><span class="name">{{ row.name }}</span><span class="phone">{{ row.phone }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column label="读者类型" width="120">
          <template #default="{ row }">
            <span class="type-tag" :class="getTypeClass(row.type)">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="借阅情况" width="160">
          <template #default="{ row }">
            <div class="borrow-progress">
              <div class="progress-bar"><div class="progress-fill" :style="{ width: (row.currentBorrow / row.borrowLimit * 100) + '%', background: getProgressColor(row) }"></div></div>
              <span class="progress-text">{{ row.currentBorrow }}/{{ row.borrowLimit }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalBorrow" label="累计借阅" width="100" />
        <el-table-column prop="joinDate" label="注册日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-badge" :class="row.status === '正常' ? 'active' : 'disabled'">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editReader(row)"><el-icon><Edit /></el-icon></el-button>
            <el-button size="small" type="danger" @click="deleteReader(row.id)"><el-icon><Delete /></el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="showAddDialog" :title="editingReader ? '编辑读者' : '添加读者'" width="560px" class="custom-dialog">
      <div class="dialog-content">
        <div class="form-row">
          <div class="form-item"><label>姓名</label><el-input v-model="formData.name" placeholder="请输入姓名" /></div>
          <div class="form-item"><label>手机号</label><el-input v-model="formData.phone" placeholder="请输入手机号" /></div>
        </div>
        <div class="form-row">
          <div class="form-item"><label>邮箱</label><el-input v-model="formData.email" placeholder="请输入邮箱" /></div>
          <div class="form-item"><label>读者类型</label><el-select v-model="formData.type" placeholder="请选择" style="width:100%">
            <el-option label="普通读者" value="普通读者" /><el-option label="VIP读者" value="VIP读者" /><el-option label="学生读者" value="学生读者" /><el-option label="教师读者" value="教师读者" />
          </el-select></div>
        </div>
        <div class="form-row">
          <div class="form-item"><label>借阅上限</label><el-input-number v-model="formData.borrowLimit" :min="1" :max="50" style="width:100%" /></div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useLibraryStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import './Readers.scss'

const store = useLibraryStore()
const searchText = ref('')
const filterType = ref('')
const filterStatus = ref('')
const showAddDialog = ref(false)
const editingReader = ref(null)

const formData = reactive({ name: '', phone: '', email: '', type: '普通读者', borrowLimit: 5 })

const filteredReaders = computed(() => {
  return store.readers.filter(r => {
    const matchSearch = !searchText.value || r.name.includes(searchText.value) || r.phone.includes(searchText.value)
    const matchType = !filterType.value || r.type === filterType.value
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchType && matchStatus
  })
})

const colors = ['#6366f1', '#06b6d4', '#f472b6', '#10b981', '#f59e0b']
const getAvatarColor = (id) => colors[id % colors.length]

const getTypeClass = (type) => {
  const map = { 'VIP读者': 'vip', '教师读者': 'teacher', '学生读者': 'student' }
  return map[type] || 'normal'
}

const getProgressColor = (row) => {
  const ratio = row.currentBorrow / row.borrowLimit
  if (ratio >= 1) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (ratio >= 0.8) return 'linear-gradient(90deg, #f59e0b, #f97316)'
  return 'linear-gradient(90deg, #10b981, #06b6d4)'
}

const editReader = (reader) => {
  editingReader.value = reader
  Object.assign(formData, { name: reader.name, phone: reader.phone, email: reader.email, type: reader.type, borrowLimit: reader.borrowLimit })
  showAddDialog.value = true
}

const deleteReader = (id) => {
  ElMessageBox.confirm('确定删除该读者？', '提示', { type: 'warning' }).then(() => {
    store.deleteReader(id); ElMessage.success('删除成功')
  }).catch(() => {})
}

const submitForm = () => {
  if (editingReader.value) {
    store.updateReader(editingReader.value.id, { ...formData }); ElMessage.success('更新成功')
  } else {
    store.addReader({ ...formData, currentBorrow: 0, totalBorrow: 0, joinDate: new Date().toISOString().split('T')[0], status: '正常' }); ElMessage.success('添加成功')
  }
  showAddDialog.value = false; editingReader.value = null
  Object.assign(formData, { name: '', phone: '', email: '', type: '普通读者', borrowLimit: 5 })
}
</script>
