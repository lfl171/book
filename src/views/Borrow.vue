<template>
  <div class="borrow-page">
    <div class="page-header">
      <h1>借阅管理</h1>
      <el-button type="primary" @click="showBorrowDialog = true"><el-icon><Plus /></el-icon>办理借阅</el-button>
    </div>

    <div class="filter-bar">
      <div class="filter-item"><el-input v-model="searchText" placeholder="搜索书名、读者..." clearable prefix-icon="Search" /></div>
      <div class="filter-item"><el-select v-model="filterStatus" placeholder="借阅状态" clearable style="width:100%">
        <el-option label="借阅中" value="借阅中" /><el-option label="已归还" value="已归还" /><el-option label="逾期" value="逾期" />
      </el-select></div>
    </div>

    <div class="borrow-table-wrap">
      <el-table :data="filteredRecords" style="width: 100%">
        <el-table-column label="图书信息" min-width="220">
          <template #default="{ row }">
            <div class="book-info-cell">
              <div class="book-mini-cover"><el-icon><Notebook /></el-icon></div>
              <div class="book-detail"><span class="title">{{ row.bookTitle }}</span><span class="reader">借阅人: {{ row.readerName }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="borrowDate" label="借阅日期" width="120" />
        <el-table-column prop="dueDate" label="应还日期" width="120" />
        <el-table-column label="归还日期" width="120">
          <template #default="{ row }">{{ row.returnDate || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="renewCount" label="续借次数" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button v-if="row.status === '借阅中' || row.status === '逾期'" size="small" type="success" @click="returnBook(row.id)">归还</el-button>
              <el-button v-if="row.status === '借阅中' && row.renewCount < 2" size="small" type="warning" @click="renewBook(row)">续借</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="showBorrowDialog" title="办理借阅" width="700px" class="custom-dialog">
      <div class="dialog-content">
        <div class="form-item full" style="margin-bottom: 16px;">
          <label>选择图书 (库存 > 0)</label>
          <div class="dialog-book-list">
            <div class="dialog-book-item" v-for="book in availableBooks" :key="book.id" :class="{ selected: selectedBook?.id === book.id }" @click="selectedBook = book">
              <div class="book-mini-cover"><el-icon><Notebook /></el-icon></div>
              <div class="info"><span class="name">{{ book.title }}</span><span class="author">{{ book.author }}</span></div>
              <span class="stock">可借 {{ book.available }}</span>
            </div>
          </div>
        </div>
        <div class="form-item full">
          <label>选择读者</label>
          <div class="dialog-reader-list">
            <div class="dialog-reader-item" v-for="reader in eligibleReaders" :key="reader.id" :class="{ selected: selectedReader?.id === reader.id }" @click="selectedReader = reader">
              <div class="avatar" :style="{ background: colors[reader.id % colors.length] }">{{ reader.name.charAt(0) }}</div>
              <div class="info"><span class="name">{{ reader.name }}</span><span class="detail">{{ reader.type }} | 已借 {{ reader.currentBorrow }}/{{ reader.borrowLimit }}</span></div>
              <span class="remaining">可借 {{ reader.borrowLimit - reader.currentBorrow }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showBorrowDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmBorrow" :disabled="!selectedBook || !selectedReader">确认借阅</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores'
import { ElMessage } from 'element-plus'
import './Borrow.scss'

const store = useLibraryStore()
const searchText = ref('')
const filterStatus = ref('')
const showBorrowDialog = ref(false)
const selectedBook = ref(null)
const selectedReader = ref(null)
const colors = ['#6366f1', '#06b6d4', '#f472b6', '#10b981', '#f59e0b']

const filteredRecords = computed(() => {
  return store.borrowRecords.filter(r => {
    const matchSearch = !searchText.value || r.bookTitle.includes(searchText.value) || r.readerName.includes(searchText.value)
    const matchStatus = !filterStatus.value || r.status === filterStatus.value
    return matchSearch && matchStatus
  })
})

const availableBooks = computed(() => store.books.filter(b => b.available > 0))
const eligibleReaders = computed(() => store.readers.filter(r => r.currentBorrow < r.borrowLimit))

const getStatusClass = (status) => {
  const map = { '借阅中': 'borrowing', '已归还': 'returned', '逾期': 'overdue' }
  return map[status] || ''
}

const confirmBorrow = () => {
  if (store.borrowBook(selectedBook.value.id, selectedReader.value.id)) {
    ElMessage.success('借阅成功')
    showBorrowDialog.value = false
    selectedBook.value = null; selectedReader.value = null
  } else {
    ElMessage.error('借阅失败，请检查库存或借阅额度')
  }
}

const returnBook = (id) => {
  if (store.returnBook(id)) ElMessage.success('归还成功')
}

const renewBook = (row) => {
  const due = new Date(row.dueDate)
  due.setDate(due.getDate() + 30)
  row.dueDate = due.toISOString().split('T')[0]
  row.renewCount++
  ElMessage.success('续借成功，新的应还日期：' + row.dueDate)
}
</script>
