<template>
  <div class="statistics-page">
    <div class="page-header"><h1>数据统计</h1></div>

    <div class="stats-overview">
      <div class="overview-card" v-for="card in overviewCards" :key="card.label" :style="{ '--color': card.color, '--bg': card.bg }">
        <div class="card-icon"><el-icon><component :is="card.icon" /></el-icon></div>
        <div class="card-value">{{ card.value }}</div>
        <div class="card-label">{{ card.label }}</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header"><h2>月度借阅趋势</h2></div>
        <div class="chart-container" ref="lineChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><h2>分类借阅占比</h2></div>
        <div class="chart-container" ref="pieChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><h2>读者类型分布</h2></div>
        <div class="chart-container" ref="barChart"></div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><h2>图书库存状态</h2></div>
        <div class="chart-container" ref="gaugeChart"></div>
      </div>
      <div class="chart-card full-width">
        <div class="chart-header"><h2>每日借阅量热力图</h2></div>
        <div class="chart-container" ref="heatmapChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useLibraryStore } from '@/stores'
import * as echarts from 'echarts'
import './Statistics.scss'

const store = useLibraryStore()
const lineChart = ref(null)
const pieChart = ref(null)
const barChart = ref(null)
const gaugeChart = ref(null)
const heatmapChart = ref(null)

const overviewCards = computed(() => [
  { label: '馆藏总量', value: store.statistics.totalBooks, icon: 'Collection', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
  { label: '活跃读者', value: store.statistics.totalReaders, icon: 'User', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
  { label: '在借图书', value: store.statistics.borrowedBooks, icon: 'Document', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
  { label: '借阅率', value: store.statistics.borrowRate + '%', icon: 'TrendCharts', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
])

const tooltipStyle = { backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(99,102,241,0.3)', textStyle: { color: '#f1f5f9' } }

const initLineChart = () => {
  const chart = echarts.init(lineChart.value)
  chart.setOption({
    tooltip: { trigger: 'axis', ...tooltipStyle },
    legend: { data: ['借出', '归还'], textStyle: { color: '#94a3b8' }, top: 0 },
    grid: { left: '3%', right: '3%', bottom: '3%', top: '40px', containLabel: true },
    xAxis: { type: 'category', data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      { name: '借出', type: 'line', smooth: true, data: [32,28,45,56,48,62,78,85,72,68,58,42], lineStyle: { color: '#6366f1', width: 3 }, itemStyle: { color: '#6366f1' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.3)' },{ offset: 1, color: 'rgba(99,102,241,0)' }] } } },
      { name: '归还', type: 'line', smooth: true, data: [28,35,40,52,45,58,72,80,68,62,52,38], lineStyle: { color: '#06b6d4', width: 3 }, itemStyle: { color: '#06b6d4' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(6,182,212,0.3)' },{ offset: 1, color: 'rgba(6,182,212,0)' }] } } }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initPieChart = () => {
  const chart = echarts.init(pieChart.value)
  chart.setOption({
    tooltip: { trigger: 'item', ...tooltipStyle },
    legend: { orient: 'vertical', right: '5%', top: 'center', textStyle: { color: '#94a3b8' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#0f172a', borderWidth: 3 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#f1f5f9' } },
      data: store.categories.map(c => ({ value: c.count, name: c.name, itemStyle: { color: c.color } }))
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initBarChart = () => {
  const chart = echarts.init(barChart.value)
  const types = ['普通读者', 'VIP读者', '学生读者', '教师读者']
  const counts = types.map(t => store.readers.filter(r => r.type === t).length)
  chart.setOption({
    tooltip: { trigger: 'axis', ...tooltipStyle },
    grid: { left: '3%', right: '3%', bottom: '3%', top: '10px', containLabel: true },
    xAxis: { type: 'category', data: types, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }, axisLabel: { color: '#94a3b8' } },
    series: [{
      type: 'bar', data: counts, barWidth: '50%',
      itemStyle: { borderRadius: [8, 8, 0, 0], color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#818cf8' },{ offset: 1, color: '#6366f1' }] } }
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initGaugeChart = () => {
  const chart = echarts.init(gaugeChart.value)
  const rate = parseFloat(store.statistics.borrowRate)
  chart.setOption({
    series: [{
      type: 'gauge', startAngle: 200, endAngle: -20,
      min: 0, max: 100,
      itemStyle: { color: '#6366f1' },
      progress: { show: true, width: 20, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#6366f1' },{ offset: 1, color: '#06b6d4' }] } } },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 20, color: [[1, 'rgba(255,255,255,0.08)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: true, offsetCenter: [0, '30%'], fontSize: 16, color: '#94a3b8' },
      detail: { valueAnimation: true, fontSize: 36, fontWeight: 'bold', color: '#f1f5f9', offsetCenter: [0, '0%'], formatter: '{value}%' },
      data: [{ value: rate, name: '借阅率' }]
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initHeatmapChart = () => {
  const chart = echarts.init(heatmapChart.value)
  const days = ['周一','周二','周三','周四','周五','周六','周日']
  const hours = ['9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
  const data = []
  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < hours.length; j++) {
      data.push([j, i, Math.floor(Math.random() * 20) + 1])
    }
  }
  chart.setOption({
    tooltip: { ...tooltipStyle, formatter: (p) => `${days[p.data[1]]} ${hours[p.data[0]]}<br/>借阅量: ${p.data[2]}` },
    grid: { left: '80px', right: '40px', bottom: '60px', top: '10px' },
    xAxis: { type: 'category', data: hours, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8' }, splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } } },
    yAxis: { type: 'category', data: days, axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }, axisLabel: { color: '#94a3b8' }, splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } } },
    visualMap: { min: 1, max: 20, calculable: true, orient: 'horizontal', left: 'center', bottom: '10px', textStyle: { color: '#94a3b8' }, inRange: { color: ['#1e1b4b', '#312e81', '#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'] } },
    series: [{ type: 'heatmap', data: data, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }]
  })
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => { nextTick(() => { initLineChart(); initPieChart(); initBarChart(); initGaugeChart(); initHeatmapChart() }) })
</script>
