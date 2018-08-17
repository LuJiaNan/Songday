import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/HomePage'
import Play from '@/pages/Play'
import List from '@/pages/List'
import Login from '@/pages/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/play',
      name: 'Play',
      component: Play
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
