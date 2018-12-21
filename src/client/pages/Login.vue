<template>
  <div class="content">
    <my-header></my-header>
    <div class="align">
      <div class="grid">
        <div class="loginForm" v-if="showLogin">
          <div class="form sign">
            <div class="form__field">
              <label for="login__username"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use></svg><span class="hidden">Username</span></label>
              <input id="login__username" type="text" name="username" v-model="username" class="form__input" placeholder="Username" required>
            </div>
            <div class="form__field">
              <label for="login__password"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#lock"></use></svg><span class="hidden">Password</span></label>
              <input id="login__password" type="password" name="password" v-model="password" class="form__input" placeholder="Password" required>
            </div>
            <div class="form__field">
              <input type="button" value="Sign In" v-on:click="login">
            </div>
          </div>
          <p class="text--center">Not a member? <a v-on:click="changeForm('register')">Sign up now</a> <svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons.svg#arrow-right"></use></svg></p>
        </div>
        <div class="registerForm" v-if="!showLogin">
          <div class="form sign">
            <div class="form__field">
              <label for="login__username"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use></svg><span class="hidden">Username</span></label>
              <input id="login__username" type="text" name="username" v-model="username" class="form__input" placeholder="Username" required>
            </div>
            <div class="form__field">
              <label for="login__password"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#lock"></use></svg><span class="hidden">Password</span></label>
              <input id="login__password" type="password" name="password" v-model="password" class="form__input" placeholder="Password" required>
            </div>
            <div class="form__field">
              <label for="login__password"><svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#lock"></use></svg><span class="hidden">Password</span></label>
              <input id="login__password_forsure" type="password" name="password_forsure" v-model="password_forsure" class="form__input" placeholder="Password_Forsure" required>
            </div>
            <div class="form__field">
              <input type="button" value="Sign Up" @click="register">
            </div>
          </div>
          <p class="text--center">Is a member? <a v-on:click="changeForm('sign')">Sign in now</a> <svg class="icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="assets/images/icons.svg#arrow-right"></use></svg></p>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" class="icons"><symbol id="arrow-right" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"/></symbol><symbol id="lock" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"/></symbol><symbol id="user" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z"/></symbol></svg>
    </div>
  </div>
</template>
<script>
import myHeader from '../components/Header.vue'
export default {
  name: 'Login',
  components: {
    myHeader
  },
  data () {
    return {
      showLogin: true,
      username: '',
      password: '',
      password_forsure: ''
    }
  },
  mounted: function () {
    this.$axios.get('static/test.json')
      .then(function (response) {
        // console.log(response.data)
      })
      .catch(function (response) {
        console.log(response)
      })
    this.clearCurrentUser()
  },
  methods: {
    changeForm: function (type) {
      this.showLogin = !this.showLogin
      if (type === 'register') {
        this.username = ''
        this.password = ''
        this.password_forsure = ''
      }
    },
    clearCurrentUser () {
      localStorage.setItem('currentUser', '')
    },
    login () {
      let userArr = JSON.parse(localStorage.getItem('userArr'))
      if (!this.username || !this.password) {
        this.$notify.error({
          title: '错误',
          message: '用户名或密码不能为空！'
        })
        return
      }
      if (!userArr) {
        this.$notify.error({
          title: '错误',
          message: '用户不存在，请先注册！'
        })
        return
      }
      const findUser = userArr => userArr.find(user => user.username === this.username)
      let user = findUser(userArr)
      if (user) {
        if (user.password !== this.password) {
          this.$notify.error({
            title: '错误',
            message: '密码错误！'
          })
          return
        }
        localStorage.setItem('currentUser', this.username)
        this.$router.push({path: '/home'})
        return
      }
      this.$notify.error({
        title: '错误',
        message: '用户不存在，请先注册！'
      })
    },
    register () {
      let userArr = JSON.parse(localStorage.getItem('userArr'))
      if (!this.username || !this.password || !this.password_forsure) {
        this.$notify.error({
          title: '错误',
          message: '用户名或密码不能为空！'
        })
        return
      }
      if (this.password !== this.password_forsure) {
        this.$notify.error({
          title: '错误',
          message: '两次密码输入不一致，请重新输入！'
        })
        return
      }
      if (userArr) {
        const findUser = userArr => userArr.find(user => user.username === this.username)
        if (findUser(userArr)) {
          this.$notify.error({
            title: '错误',
            message: '用户已存在,请直接登录！'
          })
          return
        }
        let ar = {
          username: this.username,
          password: this.password
        }
        userArr = userArr.concat(ar)
        localStorage.setItem('userArr', JSON.stringify(userArr))
        this.$notify.success({
          title: '提示',
          message: '注册成功！'
        })
        // 注册成功直接去登录
        this.showLogin = !this.showLogin
        return
      }
      let userList = {
        username: this.username,
        password: this.password
      }
      let newUserArr = []
      newUserArr.push(userList)
      localStorage.setItem('userArr', JSON.stringify(newUserArr))
      this.$notify.success({
        title: '提示',
        message: '注册成功！'
      })
    }
  }
}
</script>
<style scoped lang="less">
  @import '../assets/less/login.less';
</style>
