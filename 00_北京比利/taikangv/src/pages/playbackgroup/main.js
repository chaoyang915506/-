import Vue from 'vue'
import App from './PlayBackGroupApp.vue'
import '@/plugins/bootstrap'
import swl from '@/plugins/sweetalert'
import '@/validation'
Vue.use(swl)
new Vue({
  render:h=>h(App)
}).$mount('#app')