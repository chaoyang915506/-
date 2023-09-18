import Vue from 'vue'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './FontManageApp.vue'
import '@/validation'
Vue.use(swal)
new Vue({
  render: h => h(App)
}).$mount('#app')
