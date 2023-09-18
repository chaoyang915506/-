import Vue from 'vue'
import App from './toAirportListApp.vue'
// import swal from '@/plugins/sweetalert/swalvue'
import '@/plugins/element-ui'
import i18n from '@/i18n'
// Vue.use(swal)
new Vue({
  i18n,
  render: h => h(App)
}
).$mount('#app')