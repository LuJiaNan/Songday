<template>
  <div class="header">
    {{userName}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      userName: 'Songday'
    }
  },
  mounted: function () {
    let currentUser = localStorage.getItem('currentUser') || 'Songday'
    if (currentUser) {
      this.userName = currentUser
    }
  },
  methods: {

  }
}
</script>
<style scoped>
  @font-face {
      font-family: 'Italiana-Regular';
      src: url(../assets/fonts/Italiana-Regular.pfb.ttf);
  }
  .header{
    font-family: 'Italiana-Regular';
    font-size:24px;
    color:#fff;
  }
</style>
