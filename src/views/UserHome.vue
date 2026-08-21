<template>
  <div class="user-home">
    <div class="welcome-banner">
      <div class="welcome-text">
        <h1>欢迎回来，{{ userStore.userName }}</h1>
        <p>探索知识的海洋，开启阅读之旅</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-item">
          <span class="stat-value">{{ myBorrowCount }}</span>
          <span class="stat-label">在借图书</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ store.statistics.totalBooks }}</span>
          <span class="stat-label">馆藏图书</span>
        </div>
      </div>
    </div>

    <div class="section-header">
      <h2>热门图书推荐</h2>
      <button class="view-all-btn" @click="$router.push('/books')">查看全部</button>
    </div>

    <div class="books-grid">
      <div class="book-card" v-for="book in recommendedBooks" :key="book.id">
        <div class="book-cover">
          <el-icon><Notebook /></el-icon>
        </div>
        <div class="book-content">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-author">{{ book.author }}</div>
          <div class="book-meta">
            <span class="book-category">{{ book.category }}</span>
            <span class="book-stock" :class="{ low: book.available < 3 }">
              {{ book.available > 0 ? `可借 ${book.available}` : '已借完' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-card" @click="$router.push('/books')">
        <div class="action-icon"><el-icon><Search /></el-icon></div>
        <h3>搜索图书</h3>
        <p>浏览馆藏图书</p>
      </div>
      <div class="action-card" @click="$router.push('/my-borrow')">
        <div class="action-icon"><el-icon><Document /></el-icon></div>
        <h3>我的借阅</h3>
        <p>查看借阅记录</p>
      </div>
      <div class="action-card" @click="$router.push('/my-profile')">
        <div class="action-icon"><el-icon><User /></el-icon></div>
        <h3>个人中心</h3>
        <p>管理个人信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLibraryStore } from '@/stores'
import { useUserStore } from '@/stores/user'
import './UserHome.scss'

const store = useLibraryStore()
const userStore = useUserStore()

const myBorrowCount = computed(() => {
  return store.borrowRecords.filter(r => r.readerName === userStore.userName && r.status === '借阅中').length
})

const recommendedBooks = computed(() => store.books.slice(0, 6))
</script>
