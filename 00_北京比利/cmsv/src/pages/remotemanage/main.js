import Vue from 'vue'
import Vuex from 'vuex'

import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './RemoteManageApp.vue'
import '@/validation'
Vue.use(Vuex)
Vue.use(swal)
const store = new Vuex.Store({
  state: {}
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')