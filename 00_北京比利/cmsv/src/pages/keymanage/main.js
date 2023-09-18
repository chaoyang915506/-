import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './KeyManageApp.vue'
import '@/validation'
import Api from '@/api/Api'
import KeyManageApi from '@/api/KeyManageApi'

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    garden: [],
    keylist: []
  },
  mutations: {
    getgarden: (s, p) => s.garden = p,
    getkeylist: (s, p) => s.keylist = p
  }
})

new Vue({
  store,
  render: h => h(App),
  created () {
    Api.all([
      KeyManageApi.getGarden(),
      KeyManageApi.getbasicsKeyList()
    ], (data, data2) => {
      this.$store.commit('getgarden', data)
      this.$store.commit('getkeylist', data2.rows)
    })
  }

}).$mount('#app')