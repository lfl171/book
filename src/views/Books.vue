<template>
  <div class="books-page">
    <div class="page-header">
      <h1>图书管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true"><el-icon><Plus /></el-icon>新增图书</el-button>
        <el-button @click="exportData"><el-icon><Download /></el-icon>导出数据</el-button>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-item">
        <el-input v-model="searchText" placeholder="搜索书名、作者、ISBN..." clearable prefix-icon="Search" />
      </div>
      <div class="filter-item">
        <el-select v-model="filterCategory" placeholder="选择分类" clearable style="width:100%">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.name" />
        </el-select>
      </div>
      <div class="filter-item">
        <el-select v-model="filterStatus" placeholder="库存状态" clearable style="width:100%">
          <el-option label="充足" value="充足" /><el-option label="紧张" value="紧张" /><el-option label="缺货" value="缺货" />
        </el-select>
      </div>
    </div>

    <div class="books-grid">
      <div class="book-card" v-for="book in filteredBooks" :key="book.id">
        <div class="book-cover">
          <el-icon><Notebook /></el-icon>
          <span class="book-isbn">{{ book.isbn }}</span>
        </div>
        <div class="book-content">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-author">{{ book.author }}</div>
          <div class="book-meta">
            <span class="book-category">{{ book.category }}</span>
            <span class="book-price">¥{{ book.price }}</span>
          </div>
          <div class="book-stock">
            <div class="stock-bar">
              <div class="stock-fill" :style="{ width: (book.available / book.total * 100) + '%', background: getStockColor(book) }"></div>
            </div>
            <span class="stock-text">{{ book.available }}/{{ book.total }}</span>
          </div>
          <div class="book-actions">
            <el-button size="small" @click="editBook(book)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button size="small" type="danger" @click="deleteBook(book.id)"><el-icon><Delete /></el-icon>删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showAddDialog" :title="editingBook ? '编辑图书' : '新增图书'" width="600px" class="custom-dialog">
      <div class="dialog-content">
        <div class="form-row">
          <div class="form-item"><label>书名</label><el-input v-model="formData.title" placeholder="请输入书名" /></div>
          <div class="form-item"><label>ISBN</label><el-input v-model="formData.isbn" placeholder="请输入ISBN" /></div>
        </div>
        <div class="form-row">
          <div class="form-item"><label>作者</label><el-input v-model="formData.author" placeholder="请输入作者" /></div>
          <div class="form-item"><label>出版社</label><el-input v-model="formData.publisher" placeholder="请输入出版社" /></div>
        </div>
        <div class="form-row">
          <div class="form-item"><label>分类</label><el-select v-model="formData.category" placeholder="请选择分类" style="width:100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.name" />
          </el-select></div>
          <div class="form-item"><label>价格</label><el-input-number v-model="formData.price" :min="0" :precision="2" style="width:100%" /></div>
        </div>
        <div class="form-row">
          <div class="form-item"><label>总数量</label><el-input-number v-model="formData.total" :min="1" style="width:100%" /></div>
          <div class="form-item"><label>可借数量</label><el-input-number v-model="formData.available" :min="0" :max="formData.total" style="width:100%" /></div>
        </div>
        <div class="form-item"><label>出版日期</label><el-date-picker v-model="formData.publishDate" type="date" placeholder="选择日期" style="width:100%" /></div>
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
import './Books.scss'

const store = useLibraryStore()
const searchText = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const showAddDialog = ref(false)
const editingBook = ref(null)

const categories = computed(() => store.categories)

const formData = reactive({
  title: '', isbn: '', author: '', publisher: '', category: '', price: 0, total: 1, available: 1, publishDate: ''
})

const filteredBooks = computed(() => {
  return store.books.filter(book => {
    const matchSearch = !searchText.value || book.title.includes(searchText.value) || book.author.includes(searchText.value) || book.isbn.includes(searchText.value)
    const matchCategory = !filterCategory.value || book.category === filterCategory.value
    let matchStatus = true
    if (filterStatus.value === '充足') matchStatus = book.available > book.total * 0.5
    else if (filterStatus.value === '紧张') matchStatus = book.available <= book.total * 0.5 && book.available > 0
    else if (filterStatus.value === '缺货') matchStatus = book.available === 0
    return matchSearch && matchCategory && matchStatus
  })
})

const getStockColor = (book) => {
  const ratio = book.available / book.total
  if (ratio > 0.5) return 'linear-gradient(90deg, #10b981, #06b6d4)'
  if (ratio > 0) return 'linear-gradient(90deg, #f59e0b, #f97316)'
  return 'linear-gradient(90deg, #ef4444, #dc2626)'
}

const editBook = (book) => {
  editingBook.value = book
  Object.assign(formData, { ...book })
  showAddDialog.value = true
}

const deleteBook = (id) => {
  ElMessageBox.confirm('确定删除该图书？', '提示', { type: 'warning' }).then(() => {
    store.deleteBook(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const submitForm = () => {
  if (editingBook.value) {
    store.updateBook(editingBook.value.id, { ...formData })
    ElMessage.success('更新成功')
  } else {
    store.addBook({ ...formData })
    ElMessage.success('添加成功')
  }
  showAddDialog.value = false
  editingBook.value = null
  Object.assign(formData, { title: '', isbn: '', author: '', publisher: '', category: '', price: 0, total: 1, available: 1, publishDate: '' })
}

const exportData = () => ElMessage.success('数据导出成功')
</script>
