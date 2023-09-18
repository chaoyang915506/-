import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './WeatherCityApp.vue'
import '@/validation'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
Vue.prototype.$moment = moment

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})

new Vue({
  store,
  render: h => h(App)

}).$mount('#app')