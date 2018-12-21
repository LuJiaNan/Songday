<template>
  <div class="progressBlock" v-bind:style="progressBlock" v-on:click="changePlayProgress">
    <div class="progressTotal"></div>
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
      progressBlock: {},
      progress: {}
    }
  },
  mounted: function () {
    this.progressBlock = this.progressBlockStyle
    this.progress = this.progressStyle
  },
  methods: {
    changePlayProgress: function (e) {
      this.$emit('changePlayProgress', e)
    }
  }
}
</script>
<style scoped lang="less">
  @import '../assets/less/play.less';
</style>
