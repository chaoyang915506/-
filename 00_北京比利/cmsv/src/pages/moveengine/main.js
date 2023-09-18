import Vue from 'vue'
import Vuex from 'vuex'

import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './MoveEngineApp.vue'
import '@/validation'
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.use(Vuex)
Vue.use(swal)
const store = new Vuex.Store({
  state: {}
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')