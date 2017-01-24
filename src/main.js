import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'
import Spotify from './Spotify.vue'

Vue.use(VueResource)
Vue.use(VueRouter)

const AppRoot = Vue.extend({})

const routes = [
  {
    path: '/',
    component: App
  },
  {
    path: '/spotify',
    component: Spotify
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

const app = new Vue({
  router
}).$mount('#app-index')

