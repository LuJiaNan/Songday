<template>
  <div>{{lyricData}}</div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      lyricData: ''
    }
  },
  props: ['lyricStr'],
  mounted: function () {
    if (this.lyricStr) {
      localStorage.setItem('lyricStr', this.lyricStr)
      this.lyricData = this.lyricStr
    } else {
      let lyricStr = localStorage.getItem('lyricStr')
      this.lyricData = lyricStr
    }
    this.initLyricText(this.lyricData)
  },
  methods: {
    initLyricText: function (data) {
      console.log('44444')
      let lyricStr = data.map((value, i) => {
        // 去掉所有[时间]
        let text = value.replace(/\[.*?\]/g, '')
        return '<span v-bind:class="[currentLineNum === 0 ? activeLyric : ""]">' + text + '</span>'
      })
      console.log(lyricStr)
    }
  }
}
</script>
