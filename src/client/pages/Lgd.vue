<template>
  <div class="content">
    <my-header></my-header>
    <Lottie :options="defaultOptions" :height="400" :width="400" v-on:animCreated="handleAnimation"/>
  </div>
</template>
<script>
import myHeader from '../components/Header.vue'
import Lottie from 'vue-lottie'
import * as animationData from '../assets/json/trophy.json'
export default {
  components: {
    myHeader,
    Lottie
  },
  data () {
    return {
      defaultOptions: { animationData: animationData },
      animationSpeed: 1,
      anim: {}
    }
  },
  mounted: function () {
    console.log('LGD 咚咚咚！')
  },
  methods: {
    handleAnimation (anim) {
      this.anim = anim
    }
  }
}
</script>
<style scoped>
  .content{
    background-color: rgba(0, 0, 0, 0.9);
    color:#fff;
  }
</style>
