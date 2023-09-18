import Vue from 'vue'
import Vuex from 'vuex'

import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './SelectHotelApp.vue'
import '@/validation'


// import 'vue-bootstrap-selectpicker/dist/css/vue-bootstrap-selectpicker.min.css'
// import SelectPicker from 'vue-bootstrap-selectpicker'

// Vue.use(SelectPicker)
Vue.use(Vuex)
Vue.use(swal)
const store = new Vuex.Store({
  state:{}
})

new Vue({
  store,
  render:h=>h(App)
}).$mount('#app')