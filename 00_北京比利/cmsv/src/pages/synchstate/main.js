import Vue from 'vue'
import Vuex from 'vuex'

import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './SynchStateApp.vue'
import '@/validation'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'



import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.prototype.$moment = moment
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(swal)
const store = new Vuex.Store({
  state: {}
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')