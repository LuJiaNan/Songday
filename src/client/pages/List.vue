<template>
  <div class="content">
    <my-header></my-header>
    <ul class="musicList" v-for="(item, index) in musicList" :key="item.id">
        <li>{{index+1}}.{{item.artist}}-{{item.title}}</li>
    </ul>
  </div>
</template>
<script>
import { MUSIC_LIST } from '../assets/js/musicJson'
import myHeader from '../components/Header.vue'
export default {
  components: {
    myHeader
  },
  data () {
    return {
      musicList: MUSIC_LIST
    }
  },
  mounted: function () {
    console.log(this.musicList)
  },
  methods: {

  }
}
</script>
<style scoped>
  .content{
    background-color: rgba(0, 0, 0, 0.9);
    color:#fff;
  }
</style>
