<template>
    <div class="content">
        <my-header></my-header>
        <div id="lyricBody" class="lyricBody">
          <div id="scrollLyric" class="scrollLyric" v-bind:style="{ marginTop: scrollPx + 'px' }">
            <!-- <lyricText v-bind:lyricStr="lyricStr"></lyricText> -->
            <my-component></my-component>
          </div>
        </div>
        <audio ref='audio' v-bind:src="songUrl | getUrl"></audio>
        <div class="bottomPlayer">
          <div class="playerBlock">
            <div class="player-controls">
              <div class="prev-btn" v-on:click="playPrev"></div>
              <div v-bind:class="[playStatus ? 'pause-btn' : 'play-btn']" v-on:click="play"></div>
              <div class="next-btn" v-on:click="playNext"></div>
              <div class="player-mode" v-on:click="changeLoopType">
                <a class="mode-order" title="顺序播放" v-if="loopType === 'order'"></a>
                <a class="mode-random" title="随机播放" v-if="loopType === 'random'"></a>
                <a class="mode-single" title="单曲循环" v-if="loopType === 'single'"></a>
              </div>
            </div>
            <div class="player-info">
              <div class="track-info">
                <div class="player-track-info">
                  <a>{{artist}}</a> - <a>{{title}}</a>
                </div>
              </div>
              <div class="player-length" v-bind:style="playerLength">
                <div class="player-position">{{minutes}}:{{seconds}}</div>
                <!-- <div class="progressBlock" v-on:click="changePlayProgress">
                  <div class="progress" v-bind:style="progressStyle"></div>
                </div> -->
                <my-progress :progressBlockStyle="progressBlockStyle" :progressStyle="progressStyle" @changePlayProgress="changePlayProgress"></my-progress>
                <div class="player-duration">{{initMinutes}}:{{initSeconds}}</div>
              </div>
              <div class="player-cover">
                <img v-bind:src="cover | getUrl" alt="封面" class="cover">
              </div>
            </div>
            <div class="player-volume">
              <div id="volume">
                <div v-bind:class="[volumeStatus == 'on' ? 'volume-on' : 'volume-off', 'volume-control']" v-on:click="changeVolumeIcon"></div>
                <div class="volumeBlock" v-bind:style="{ width: maxVolume + 'px'}" v-on:click="changeVolume" @mouseover="changeVolume" @mousemove="changeVolume">
                  <div class="volumeTotal"></div>
                  <div class="volumeProgress" v-bind:style="{ width: currentVolume + 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import myHeader from '../components/Header.vue'
import myProgress from '../components/Progress.vue'
import lyricText from '../components/LyricText.vue'
import { MUSIC_LIST } from '../assets/js/musicJson'
import { Button } from 'element-ui/lib/button'
import Lyric from 'lyric-parser'
import { _ } from 'underscore'
import { LYRIC } from '../assets/js/lyricJson'
export default{
  name: 'Play',
  components: {
    myHeader,
    myProgress,
    lyricText,
    Button
  },
  data () {
    return {
      name: 'play',
      artist: '',
      title: '',
      cover: '',
      musicList: MUSIC_LIST,
      songUrl: '',
      leftTime: 0,
      initMinutes: 0,
      initSeconds: 0,
      minutes: 0,
      seconds: 0,
      randomSongIndex: 0,
      playStatus: true,
      volumeStatus: 'on',
      loopType: 'random',
      maxVolume: 100,
      currentVolume: 0,
      playerLength: {
        width: '300px'
      },
      progressStyle: {
        width: 0,
        background: 'greenyellow'
      },
      progressBlockStyle: {
        width: '300px'
      },
      lyricStr: '',
      lyricHtml: '',
      currentTime: 0,
      scrollPx: 0,
      currentLineNum: 0,
      lyricIndex: 1
    }
  },
  mounted: function () {
    // this.randomSongIndex = Math.floor(Math.random() * this.musicList.length)
    // 成都测试
    this.randomSongIndex = 1
    this.initPlayer()
    this.bind()
  },
  methods: {
    initPlayer: function () {
      let self = this
      let myAudio = self.$refs.audio
      self.songUrl = self.musicList[self.randomSongIndex].file
      self.artist = self.musicList[self.randomSongIndex].artist
      self.title = self.musicList[self.randomSongIndex].title
      self.cover = self.musicList[self.randomSongIndex].cover
      // self.seconds = 0
      // // 解决播放时间跳跃不均匀问题
      // self.interval = setInterval(function () {
      //   self.seconds++
      // }, 1000)
      // 改变url之后调用播放方法
      this.initLyric(this.lyricIndex)
      myAudio.load()
      const lyric = new Lyric(this.lyricStr, function (obj) {
        self.playLyric(self.lyricIndex, obj.lineNum)
      })
      this.lyricObj = lyric
      this.lyricObj.stop()
      this.lyricObj.play()
      this.originTime = Date.parse(new Date())
    },
    initLyric: function (index) {
      // 用组件时的参数
      // this.lyricStr = LYRIC[index].str
      // 不用组件
      // let str = LYRIC[index].str.map((value, i) => {
      //   return value + '\n'
      // })
      Vue.component('my-component', {
        render: function (createElement, context) {
          return createElement('div',
            LYRIC[index].str.map((value, i) => {
              let text = value.replace(/\[.*?\]/g, '')
              return createElement('span', [
                createElement('br', ''),
                createElement('span', text)
              ])
            })
          )
        }
      })
      this.lyricStr = LYRIC[index].str.join('</br>\n')
      // lyricStr = lyricStr.join('</br>\n')
      // // 去掉所有[时间]
      // let lyric = lyricStr.replace(/\[.*?\]/g, '')
      // // 去掉/n
      // this.lyricHtml = lyric.replace(/\n/g, '')
      // this.lyricStr = lyricStr
    },
    // 歌词随播放进度滚动，且样式可定制
    playLyric: function (index, lineNum) {
      // console.log(lineNum)
      this.scrollPx = -lineNum * 20
      Vue.component('my-component', {
        render: function (createElement, context) {
          return createElement('div',
            LYRIC[index].str.map((value, i) => {
              let text = value.replace(/\[.*?\]/g, '')
              let active = i - 5 === lineNum
              return createElement('span', [
                createElement('br', ''),
                createElement('span', {style: {
                  color: active ? 'deepskyblue' : '',
                  fontSize: active ? '18px' : '',
                  opacity: 1 - Math.abs(i - 5 - lineNum) / 20
                }}, text)
              ])
            })
          )
        }
      })
    },
    bind: function () {
      let self = this
      let myAudio = self.$refs.audio
      myAudio.oncanplay = function () {
        myAudio.play()
      }
      myAudio.onplay = function () {
        myAudio.volume = self.currentVolume / self.maxVolume
        let minutes = Math.floor(parseFloat(myAudio.duration) / 60)
        let seconds = Math.floor(parseFloat(myAudio.duration) % 60)
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        self.initMinutes = minutes
        self.initSeconds = seconds
      }
      //  播放结束调用方法
      myAudio.onended = function () {
        if (self.loopType === 'random') {
          let random = Math.floor(Math.random() * self.musicList.length)
          // 解决随机数相等问题
          while (self.randomSongIndex === random) {
            random = Math.floor(Math.random() * self.musicList.length)
          }
          self.randomSongIndex = random
        } else if (self.loopType === 'order') {
          self.randomSongIndex = self.randomSongIndex + 1
        } else if (self.loopType === 'single') {
          // dosomething
        } else {
          // dosomething
        }
        // clearInterval(this.interval)
        self.initPlayer()
      }
      //   进度条
      myAudio.ontimeupdate = function () {
        let minutes = Math.floor(parseFloat(myAudio.currentTime) / 60)
        let seconds = Math.floor(parseFloat(myAudio.currentTime) % 60)
        if (seconds < 10) {
          seconds = '0' + seconds
        }
        self.minutes = minutes
        self.seconds = seconds
        self.progressStyle.width = (parseFloat(myAudio.currentTime) / parseFloat(myAudio.duration)) * 100 + '%'
      }
    },
    play: function () {
      this.playStatus = !this.playStatus
      if (this.playStatus) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    playPrev: function () {
      this.playStatus = true
      if (this.loopType === 'random') {
        let random = Math.floor(Math.random() * this.musicList.length)
        // 解决随机数相等问题
        while (this.randomSongIndex === random) {
          random = Math.floor(Math.random() * this.musicList.length)
        }
        this.randomSongIndex = random
      } else {
        this.randomSongIndex = (this.randomSongIndex - 1 + this.musicList.length) % this.musicList.length
      }
      // clearInterval(this.interval)
      this.initPlayer()
    },
    playNext: function () {
      this.playStatus = true
      if (this.loopType === 'random') {
        let random = Math.floor(Math.random() * this.musicList.length)
        // 解决随机数相等问题
        while (this.randomSongIndex === random) {
          random = Math.floor(Math.random() * this.musicList.length)
        }
        this.randomSongIndex = random
      } else {
        this.randomSongIndex = (this.randomSongIndex + 1 + this.musicList.length) % this.musicList.length
      }
      // clearInterval(this.interval)
      this.initPlayer()
    },
    changeVolumeIcon: function () {
      if (this.volumeStatus === 'on') {
        this.volumeStatus = 'off'
        this.$refs.audio.volume = 0
        this.currentVolume = 0
      } else {
        this.volumeStatus = 'on'
        this.$refs.audio.volume = 0.3
        this.currentVolume = 30
      }
    },
    changeVolume: function (e) {
      let position = e.offsetX
      if (position < 0) {
        position = 0
        this.volumeStatus = 'off'
      } else {
        this.volumeStatus = 'on'
      }
      this.$refs.audio.volume = position / 100
      this.currentVolume = position
    },
    changeLoopType: function () {
      if (this.loopType === 'random') {
        this.loopType = 'order'
      } else if (this.loopType === 'order') {
        this.loopType = 'single'
      } else {
        this.loopType = 'random'
      }
    },
    changePlayProgress: function (e) {
      let currentTime = (parseInt(e.offsetX) / parseInt(this.playerLength.width)) * parseInt(this.$refs.audio.duration)
      this.$refs.audio.currentTime = currentTime
      this.startTime = Date.parse(new Date())
      // console.log(currentTime)
      let lyricArr = LYRIC[this.lyricIndex].str.map((value, i) => {
        let str = value.substring(value.indexOf('[') + 1, value.indexOf(']'))
        let arr = str.split(':')
        let re = /^0|[1-9]+[0-9]*]*$/ // 判断字符串是否为整数
        console.log(re.test(parseInt(arr[0])))
        if (re.test(arr[0])) {
          return Math.abs(parseInt(arr[0]) * 60 + parseInt(arr[1]) - parseInt(currentTime))
        } else {
          return Math.abs(0 - parseInt(currentTime))
        }
      })
      let min = _.min(lyricArr)
      let index = _.indexOf(lyricArr, min)
      console.log(index)
      this.lyricObj.stop()
      this.lyricObj.play(this.startTime - this.originTime)
      // let currentLine = LYRIC[this.lyricIndex].str[index]
      this.playLyric(this.lyricIndex, index)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/play.less';
</style>
