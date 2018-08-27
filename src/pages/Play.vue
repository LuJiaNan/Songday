<template>
    <div class="content">
        <my-header></my-header>
        <div id="lyricBody" class="lyricBody">
          <div id="scrollLyric" class="scrollLyric" v-bind:style="{ marginTop: scrollPx + 'px' }" v-html={lyricHtml}>
            <!-- <lyricText v-bind:lyricStr="lyricStr"></lyricText> -->
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
                <div class="progressBlock" v-on:click="changePlayProgress">
                  <div class="progress" v-bind:style="progressStyle"></div>
                </div>
                <div class="player-duration">{{initMinutes}}:{{initSeconds}}</div>
              </div>
              <div class="player-cover">
                <img v-bind:src="cover | getUrl" alt="封面" class="cover">
              </div>
            </div>
            <div class="player-volume">
              <div id="volume">
                <div v-bind:class="[volumeStatus == 'on' ? 'volume-on' : 'volume-off', 'volume-control']" v-on:click="changeVolumeIcon"></div>
                <div class="volumeBlock" v-bind:style="{ width: maxVolume + 'px' }" v-on:click="changeVolume">
                  <div class="volumeProgress" v-bind:style="{ width: currentVolume + 'px'}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <my-progress :progressBlockStyle="progressBlockStyle" :progressStyle="progressStyle"></my-progress> -->
    </div>
</template>

<script>
import myHeader from '../components/Header.vue'
import myProgress from '../components/Progress.vue'
import lyricText from '../components/LyricText.vue'
import { MUSIC_LIST } from '../assets/js/musicJson'
import { Button } from 'element-ui/lib/button'
import Lyric from 'lyric-parser'
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
        background: 'deepskyblue'
      },
      lyricStr: '',
      lyricHtml: '',
      currentTime: 0,
      scrollPx: 0,
      currentLineNum: 0
    }
  },
  mounted: function () {
    this.randomSongIndex = Math.floor(Math.random() * this.musicList.length)
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
      this.initLyric(1)
      myAudio.load()
      const lyric = new Lyric(this.lyricStr, function (obj) {
        let present = Date.parse(new Date())
        // let time = present - self.currentTime
        self.currentTime = present
        self.scrollPx = -obj.lineNum * 25
        console.log(self.scrollPx)
      })
      lyric.stop()
      lyric.play()
    },
    initLyric: function (index) {
      // 用组件时的参数
      // this.lyricStr = LYRIC[index].str
      // 不用组件
      let lyricStr = LYRIC[index].str.map((value, i) => {
        return '<span>' + value + '</span>'
      })
      lyricStr = lyricStr.join('</br>\n')
      // 去掉所有[时间]
      let lyric = lyricStr.replace(/\[.*?\]/g, '')
      // 去掉/n
      this.lyricHtml = lyric.replace(/\n/g, '')
      this.lyricStr = lyricStr
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
      this.$refs.audio.currentTime = (parseInt(e.offsetX) / parseInt(this.playerLength.width)) * parseInt(this.$refs.audio.duration)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/play.less';
</style>
