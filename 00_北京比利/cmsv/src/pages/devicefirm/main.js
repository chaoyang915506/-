import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './DeviceFirmApp.vue'
import '@/validation'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})


new Vue({
  store,
  render: h => h(App)

}).$mount('#app')