import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './ColumnManageApp.vue'

import '@/validation'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import 'vue-multiselect/dist/vue-multiselect.min.css'
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})

new Vue({
  store,
  render: h => h(App)

}).$mount('#app')