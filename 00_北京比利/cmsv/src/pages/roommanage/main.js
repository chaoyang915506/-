import Vue from 'vue'
import App from './RoomManageApp.vue'


import Vuex from 'vuex'

import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
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