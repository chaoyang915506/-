import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './MoviceListApp.vue'
import '@/validation'
// import 'bootstrap'
// import 'bootstrap/js/dist/util'
// import 'bootstrap/js/dist/alert'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import MoviceListApi from '@/api/MoviceListApi.js'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    copyrightlist: [],
    locationlist: [],//版权区域
    groupstatelis: [],//版权下的数据
  },
  mutations: {
    getcopyright: ((s, p) => s.copyrightlist = p),
    getlocation: ((s, p) => s.locationlist = p),
    getstatelist: ((s, p) => { s.groupstatelis = p })
  }
})


new Vue({
  store,
  render: h => h(App),
  created () {
    // Api.all([MoviceListApi.getcopyrightpost()
    // ], (location) => {
    //   this.$store.commit('getlocation', location.rows)
    // }).catch(err => {
    //   console.log(err)
    // })


    MoviceListApi.getcopyrightpost().then(location => {
      this.$store.commit('getlocation', location.rows)
    }).catch(err => {
      console.log(err)
    })


  }

}).$mount('#app')