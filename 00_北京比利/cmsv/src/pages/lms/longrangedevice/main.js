import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './LongRangeDeviceApp.vue'
import '@/validation'
import i18n from '@/i18n'

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
})

new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')