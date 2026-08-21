<template>
  <div class="particle-container" ref="container">
    <canvas ref="canvas"></canvas>
    <div class="gradient-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref(null)
const canvas = ref(null)
let ctx = null
let particles = []
let animationId = null
let mouse = { x: 0, y: 0 }

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * 2 + 0.5
    this.speedX = (Math.random() - 0.5) * 0.8
    this.speedY = (Math.random() - 0.5) * 0.8
    this.opacity = Math.random() * 0.5 + 0.2
    this.hue = Math.random() * 60 + 220
    this.pulseSpeed = Math.random() * 0.02 + 0.01
    this.pulseOffset = Math.random() * Math.PI * 2
  }

  update(time) {
    this.x += this.speedX
    this.y += this.speedY

    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 150) {
      const force = (150 - dist) / 150
      this.x -= dx * force * 0.02
      this.y -= dy * force * 0.02
    }

    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1

    this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulseOffset))
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.currentOpacity})`
    ctx.fill()
  }
}

const init = () => {
  const cvs = canvas.value
  ctx = cvs.getContext('2d')
  resize()
  
  const particleCount = Math.min(120, Math.floor((cvs.width * cvs.height) / 15000))
  particles = Array.from({ length: particleCount }, () => new Particle(cvs))
  
  animate(0)
}

const resize = () => {
  const cvs = canvas.value
  cvs.width = window.innerWidth
  cvs.height = window.innerHeight
}

const drawConnections = () => {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 120) {
        const opacity = (1 - dist / 120) * 0.15
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

const animate = (time) => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  particles.forEach(p => {
    p.update(time)
    p.draw(ctx)
  })
  
  drawConnections()
  animationId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

onMounted(() => {
  init()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.particle-container {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

canvas {
  display: block;
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(244, 114, 182, 0.08) 0%, transparent 60%);
  pointer-events: none;
}
</style>
