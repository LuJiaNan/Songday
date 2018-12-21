<template>
  <div v-html="lyricHtml" class="lyricHtml">{{lyricHtml}}</div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      lyricData: '',
      lyricHtml: ''
    }
  },
  props: ['lyricStr'],
  mounted: function () {
    if (this.lyricStr) {
      localStorage.setItem('lyricStr', JSON.stringify(this.lyricStr))
      this.lyricData = this.lyricStr
    } else {
      let lyricStr = JSON.parse(localStorage.getItem('lyricStr'))
      this.lyricData = lyricStr
    }
    this.initLyricText(this.lyricData)
  },
  methods: {
    initLyricText: function (data) {
      console.log(data)
      let lyricStr = data.map((value, i) => {
        // 去掉所有[时间]
        let text = value.replace(/\[.*?\]/g, '')
        return '<span>' + text + '</span>'
      })
      this.lyricHtml = lyricStr.join('</br>\n')
    }
  }
}
</script>
<style scoped>
  .lyricHtml{
    width:100%;
    height:100%;
  }
</style>
