import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './guiDanceApp.vue'

import '@/validation'
import guiDanceApi from '@/api/guiDanceApi'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    hotel: []
  },
  mutations: {
    gethotel: (s, p) => s.hotel = p,
  }
})

new Vue({
  store,
  render: h => h(App),
  created () {
    guiDanceApi.allHotel().then(data => {
      // console.log(data.list)
      this.$store.commit('gethotel',data.list)
    }).then(err => {
      console.log(err)
      // this.$error('获取数据失败')
    })
  }
}).$mount('#app')