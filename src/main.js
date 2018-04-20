import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import Chart from 'chart.js'
import $ from 'jquery';

import SimilarArtists from './component/similar_artists.vue'
import AvgAudioFeature from './component/avg_audio_feature.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue);

Vue.component("avgfeat", AvgAudioFeature);
Vue.component("similarartists", SimilarArtists);
new Vue({
  el: '#app',
  render: h => h(App)
})
