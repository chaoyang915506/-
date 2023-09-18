import Vue from 'vue'
import App from './App.vue'
import store from './store'
import '@/plugins/bootstrap'
import i18n from '@/i18n/index'

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
