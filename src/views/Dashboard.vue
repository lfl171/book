<template>
  <div class="dashboard">
    <div class="page-header">
      <div class="welcome-section">
        <h1>欢迎回来，管理员</h1>
        <p>今天是{{ today }}，祝您工作愉快</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in statsCards" :key="stat.label" :style="{ '--accent': stat.color, '--accent-bg': stat.bgColor }">
        <div class="stat-icon"><el-icon><component :is="stat.icon" /></el-icon></div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        <div class="stat-change" :class="stat.changeType">{{ stat.change }}</div>
      </div>
    </div>

    <div class="main-grid">
      <div class="left-column">
        <div class="section-card">
          <div class="section-header">
            <h2>借阅趋势</h2>
            <button class="view-all-btn">查看详情</button>
          </div>
          <div class="chart-container" ref="trendChart"></div>
        </div>
        <div class="section-card" style="margin-top: 24px;">
          <div class="section-header">
            <h2>最近借阅</h2>
            <button class="view-all-btn" @click="$router.push('/borrow')">查看全部</button>
          </div>
          <div class="borrow-list">
            <div class="borrow-item" v-for="item in recentBorrows" :key="item.id">
              <div class="book-cover"><el-icon><Notebook /></el-icon></div>
              <div class="book-info">
                <div class="book-title">{{ item.bookTitle }}</div>
                <div class="book-reader">借阅人: {{ item.readerName }}</div>
              </div>
              <div class="borrow-date">
                <span class="date">{{ item.borrowDate }}</span>
                <span class="days" :class="getDaysClass(item)">{{ getDaysText(item) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="section-card">
          <div class="section-header"><h2>图书分类</h2></div>
          <div class="category-list">
            <div class="category-item" v-for="cat in categories" :key="cat.id">
              <div class="cat-icon" :style="{ background: cat.color + '20', color: cat.color }"><el-icon><component :is="cat.icon" /></el-icon></div>
              <div class="cat-info"><div class="cat-name">{{ cat.name }}</div><div class="cat-count">{{ cat.count }} 本</div></div>
            </div>
          </div>
        </div>
        <div class="section-card" style="margin-top: 24px;">
          <div class="section-header"><h2>快捷操作</h2></div>
          <div class="quick-actions">
            <div class="action-btn" @click="$router.push('/books')">
              <div class="action-icon"><el-icon><DocumentAdd /></el-icon></div>
              <span class="action-text">新增图书</span>
            </div>
            <div class="action-btn" @click="$router.push('/readers')">
              <div class="action-icon"><el-icon><UserFilled /></el-icon></div>
              <span class="action-text">添加读者</span>
            </div>
            <div class="action-btn" @click="$router.push('/borrow')">
              <div class="action-icon"><el-icon><Finished /></el-icon></div>
              <span class="action-text">办理借阅</span>
            </div>
          </div>
        </div>
        <div class="section-card" style="margin-top: 24px;">
          <div class="section-header"><h2>分类占比</h2></div>
          <div class="chart-container" ref="pieChart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useLibraryStore } from '@/stores'
import * as echarts from 'echarts'
import './Dashboard.scss'

const store = useLibraryStore()
const trendChart = ref(null)
const pieChart = ref(null)

const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

const statsCards = computed(() => [
  { label: '馆藏图书', value: store.statistics.totalBooks, icon: 'Collection', color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)', change: '+12%', changeType: 'up' },
  { label: '注册读者', value: store.statistics.totalReaders, icon: 'User', color: '#06b6d4', bgColor: 'rgba(6,182,212,0.15)', change: '+5%', changeType: 'up' },
  { label: '在借图书', value: store.statistics.borrowedBooks, icon: 'Document', color: '#f472b6', bgColor: 'rgba(244,114,182,0.15)', change: store.statistics.borrowRate + '%', changeType: 'up' },
  { label: '逾期未还', value: store.statistics.overdueBorrows, icon: 'WarningFilled', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)', change: '-2', changeType: 'down' },
])

const recentBorrows = computed(() => store.borrowRecords.slice(0, 5))
const categories = computed(() => store.categories)

const getDaysClass = (item) => {
  if (item.status === '已归还') return 'normal'
  const days = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'danger'
  if (days < 7) return 'warning'
  return 'normal'
}

const getDaysText = (item) => {
  if (item.status === '已归还') return '已归还'
  const days = Math.ceil((new Date(item.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0) return `逾期${Math.abs(days)}天`
  return `剩余${days}天`
}

const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } },
    grid: { left: '3%', right: '3%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      { name: '借出', type: 'line', smooth: true, data: [32,28,45,56,48,62,78,85,72,68,58,42], lineStyle: { color: '#6366f1', width: 3 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.3)' },{ offset: 1, color: 'rgba(99,102,241,0)' }] } }, itemStyle: { color: '#6366f1' } },
      { name: '归还', type: 'line', smooth: true, data: [28,35,40,52,45,58,72,80,68,62,52,38], lineStyle: { color: '#06b6d4', width: 3 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(6,182,212,0.3)' },{ offset: 1, color: 'rgba(6,182,212,0)' }] } }, itemStyle: { color: '#06b6d4' } }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initPieChart = () => {
  const chart = echarts.init(pieChart.value)
  chart.setOption({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } },
    series: [{
      type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#0f172a', borderWidth: 3 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#f1f5f9' } },
      labelLine: { show: false },
      data: categories.value.map(c => ({ value: c.count, name: c.name, itemStyle: { color: c.color } }))
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  nextTick(() => { initTrendChart(); initPieChart() })
})
</script>
