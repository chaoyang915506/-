import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './DeviceTriggerType.vue'
import '@/validation'
import Api from '@/api/Api'
import { StrategyApi } from '../LmsApi'
import i18n from '@/i18n'

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    strategy: [],
    keylist: []
  },
  mutations: {
    getStrategy: (s, p) => s.strategy = p,
  }
})

new Vue({
  store,
  i18n,
  render: h => h(App),
  created () {
    Api.all([
      StrategyApi.list(),
    ], (data, data2) => {
      this.$store.commit('getStrategy', data)
    })
  }

}).$mount('#app')