import Vue from 'vue'
import App from './ResourceApp.vue'
import swal from '@/plugins/sweetalert/swalvue'
import i18n from '@/i18n'
import '@/plugins/element-ui'
Vue.use(swal)
Vue.config.productionTip = process.env.NODE_ENV === "production"
Vue.config.devtools = process.env.NODE_ENV !== "production"

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')