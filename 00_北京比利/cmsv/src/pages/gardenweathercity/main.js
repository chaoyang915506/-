import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './GardenWeatherCityApp.vue'
import '@/validation'

// import 'vue-bootstrap-selectpicker/dist/css/vue-bootstrap-selectpicker.min.css'
// import SelectPicker from 'vue-bootstrap-selectpicker'

// Vue.use(SelectPicker)
import 'vue-multiselect/dist/vue-multiselect.min.css'

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})

new Vue({
  store,
  render: h => h(App)

}).$mount('#app')