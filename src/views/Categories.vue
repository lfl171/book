<template>
  <div class="categories-page">
    <div class="page-header">
      <h1>分类管理</h1>
      <el-button type="primary" @click="showAddDialog = true"><el-icon><Plus /></el-icon>新增分类</el-button>
    </div>
    <div class="categories-grid">
      <div class="category-card" v-for="cat in store.categories" :key="cat.id" :style="{ '--cat-color': cat.color, '--cat-bg': cat.color + '20' }">
        <div class="card-header">
          <div class="cat-icon"><el-icon><component :is="cat.icon" /></el-icon></div>
          <div class="card-actions">
            <el-button @click="editCategory(cat)"><el-icon><Edit /></el-icon></el-button>
            <el-button @click="deleteCategory(cat.id)"><el-icon><Delete /></el-icon></el-button>
          </div>
        </div>
        <div class="cat-name">{{ cat.name }}</div>
        <div class="cat-count">{{ cat.count }}</div>
        <div class="cat-label">本图书</div>
        <div class="cat-bar"><div class="cat-bar-fill" :style="{ width: (cat.count / maxCount * 100) + '%' }"></div></div>
      </div>
    </div>

    <el-dialog v-model="showAddDialog" :title="editingCategory ? '编辑分类' : '新增分类'" width="420px" class="custom-dialog">
      <div class="dialog-content">
        <div class="form-item"><label>分类名称</label><el-input v-model="formData.name" placeholder="请输入分类名称" /></div>
        <div class="form-item"><label>图标名称</label><el-input v-model="formData.icon" placeholder="Element Plus 图标名" /></div>
        <div class="form-item"><label>主题颜色</label><el-color-picker v-model="formData.color" show-alpha /></div>
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
import './Categories.scss'

const store = useLibraryStore()
const showAddDialog = ref(false)
const editingCategory = ref(null)
const formData = reactive({ name: '', icon: 'Files', color: '#6366f1' })

const maxCount = computed(() => Math.max(...store.categories.map(c => c.count)))

const editCategory = (cat) => {
  editingCategory.value = cat
  Object.assign(formData, { name: cat.name, icon: cat.icon, color: cat.color })
  showAddDialog.value = true
}

const deleteCategory = (id) => {
  ElMessageBox.confirm('确定删除该分类？', '提示', { type: 'warning' }).then(() => {
    store.categories.splice(store.categories.findIndex(c => c.id === id), 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const submitForm = () => {
  if (editingCategory.value) {
    Object.assign(editingCategory.value, { ...formData })
    ElMessage.success('更新成功')
  } else {
    store.categories.push({ id: Date.now(), count: 0, ...formData })
    ElMessage.success('添加成功')
  }
  showAddDialog.value = false; editingCategory.value = null
  Object.assign(formData, { name: '', icon: 'Files', color: '#6366f1' })
}
</script>
