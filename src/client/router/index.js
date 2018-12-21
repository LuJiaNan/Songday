import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/client/pages/HomePage'
import Play from '@/client/pages/Play'
import List from '@/client/pages/List'
import Login from '@/client/pages/Login'
import LGD from '@/client/pages/LGD'

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
    },
    {
      path: '/lgd',
      name: 'LGD',
      component: LGD
    }
  ]
})
