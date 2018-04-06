import Vue from 'vue'
import App from './App.vue'
import Module1 from './component/module1.vue'

Vue.component("mod1", Module1);
new Vue({
  el: '#app',
  render: h => h(App)
})
