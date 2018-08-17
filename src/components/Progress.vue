<template>
  <div class="progressBlock" v-bind:style="progressBlock">
    <div class="progress" v-bind:style="progress"></div>
  </div>
</template>
<script>
export default {
  name: 'Progress',
  props: [
    'progressBlockStyle',
    'progressStyle'
  ],
  data () {
    return {
      progressBlock: {
        width: 0
      },
      progress: {
        background: '#fff',
        width: 0
      }
    }
  },
  methods: {
    update: function () {
      console.log(this.progressStyle.width)
    }
  },
  created: function () {
    this.progressBlock.width = this.progressBlockStyle.width
    this.progress.background = this.progressStyle.color
    this.progress.width = this.progressStyle.width
  },
  watch: {
    progressBlock: function (newValue, oldValue) {
      console.log(newValue)
      this.update()
    },
    progress: function (newValue, oldValue) {
      console.log(newValue)
      this.update()
    }
  }
}
</script>
<style scoped>
    .progressBlock{
        height:3px;
        background:#dfdfdf;
    }
    .progress{
        height:100%;
        /* background:dodgerblue; */
    }
</style>
