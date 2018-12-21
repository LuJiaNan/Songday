<template>
  <div class="content">
    <header><h1>{{title}}</h1></header>
    <div class="bar">
      <a href="javascript:;" class="toggle"><span>Menu</span></a>
    </div>
    <nav class="menu">
      <ul>
        <li><router-link to="/play">Play</router-link></li>
        <li><router-link to="/list">List</router-link></li>
        <li><router-link to="/login">Logout</router-link></li>
        <li><router-link to="/lgd">LGD</router-link></li>
        <li><a href="#timetable">Lineup</a></li>
        <li><a href="#tickets">Timetable</a></li>
        <li><a href="#access">Access</a></li>
      </ul>
    </nav>
    <audio loop ref='audio' autoplay></audio>
  </div>
</template>

<script>
import { MUSIC_LIST } from '../assets/js/indexMusicJson'
export default {
  name: 'Songday',
  data () {
    return {
      title: 'Songday',
      musicList: MUSIC_LIST,
      randomSongIndex: 0
    }
  },
  mounted: function () {
    this.$refs.audio.volume = 0.1
    this.initPlayer()
    this.initBanner()
  },
  methods: {
    initPlayer: function () {
      this.randomSongIndex = Math.floor(Math.random() * this.musicList.length)
      this.$refs.audio.src = this.musicList[this.randomSongIndex].file
      this.$refs.audio.load()
    },
    initBanner: function () {
      'use strict'
      const togglebar = document.querySelector('.bar')
      const toggle = document.querySelector('.toggle')
      const menu = document.querySelector('.menu')
      const menulinks = document.querySelectorAll('.menu a')
      let togglefunc = () => {
        toggle.classList.toggle('open')
        menu.classList.toggle('open')
      }
      togglebar.onclick = togglefunc
      menulinks.forEach((e) => {
        e.onclick = togglefunc
      })
      const VW = window.innerWidth
      const VH = window.innerHeight
      let getContext = (w, h, c) => {
        let canvas = document.createElement('canvas')
        canvas.classList.add('header-canvas')
        document.querySelector('header').appendChild(canvas)
        canvas.width = w || window.innerWidth
        canvas.height = h || window.innerHeight
        return canvas.getContext('2d')
      }
      const ctx = getContext(VW, VH)
      class Particle {
        constructor (x, y, radius, opacity) {
          this.x = x
          this.y = y
          this.vx = 0
          this.vy = 0
          this.radius = 0
          this.targetRadius = radius
          this.opacity = 0
          this.targetOpacity = opacity
          this.waxing = true
        }
        move () {
          this.vy -= 0.005
          this.y += this.vy
          this.radius += (this.targetRadius - this.radius) / 50
          this.opacity += (this.targetOpacity - this.opacity) / 50
          if (this.y < 0) {
            return true
          } else {
            return false
          }
        }
        draw (ctx) {
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${this.opacity / 100})`
          ctx.fill()
        }
      }
      const particles = []
      let update = () => {
        let s = Math.round(Math.random() * 100)
        if (s < 10) {
          let p = new Particle(Math.round(Math.random() * VW), Math.round(Math.random() * VH), Math.ceil(Math.random() * 3), Math.round(Math.random() * 50 + 25))
          particles.push(p)
        }
        let a = []
        particles.forEach((e) => {
          if (!e.move()) {
            a.push(e)
          }
        })
        particles.length = 0
        a.forEach((e) => {
          particles.push(e)
        })
      }
      let draw = () => {
        ctx.clearRect(0, 0, VW, VH)
        particles.forEach((e) => {
          e.draw(ctx)
        })
      }
      setInterval(frame, 16)
      function frame () {
        update()
        draw()
      }
      frame()
    }
  }
}
</script>
<style scoped>
  @import '../assets/less/home.less';
</style>
