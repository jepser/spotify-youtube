import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'
import Spotify from './Spotify.vue'

Vue.use(VueResource)
Vue.use(VueRouter)

// var app = new Vue({
//   el: 'body',
//   components: { App}
// })

var AppRoot = Vue.extend({})

var router = new VueRouter({
  history: true,
  html5: true
})

router.map({
  '/': {
    component: App
  },
  '/spotify': {
    component: Spotify
  }
  // '/youtube': {

// }
})

router.start(AppRoot, '#app-index')
