import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import Module1 from './component/module1.vue'
import $ from 'jquery';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

Vue.component("mod1", Module1);
new Vue({
  el: '#app',
  render: h => h(App)
})
