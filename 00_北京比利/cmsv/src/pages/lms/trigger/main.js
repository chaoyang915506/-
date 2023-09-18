import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './TriggerApp.vue'
import '@/validation'
import Api from '@/api/Api'
import { TriggerApi } from '../LmsApi'
import i18n from '@/i18n'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    strategy: [],
    keylist: []
  },
  mutations: {
    getTrigger: (s, p) => s.trigger = p,
  }
})

new Vue({
  store,
  i18n,
  render: h => h(App),
  created () {
    Api.all([
      TriggerApi.list,
      // KeyManageApi.getbasicsKeyList()
    ], (data) => {
      this.$store.commit('getTrigger', data)
      // this.$store.commit('getkeylist', data2.rows)
    })
  }

}).$mount('#app')