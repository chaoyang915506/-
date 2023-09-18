import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './DeviceTypeApp.vue'
import '@/validation'
import DeviceFirmApi from '@/api/DeviceFirmApi.js'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    firm: []
  },
  mutations: {
    setfirm: (s, p) => s.firm = p
  }
})

new Vue({
  store,
  render: h => h(App),
  created () {
    DeviceFirmApi.getfirm().then(data => {
      this.$store.commit('setfirm', data.list)
    })
  }

}).$mount('#app')