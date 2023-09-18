import Vue from 'vue'
import App from './ChargingStrategyApp.vue'
import swal from '@/plugins/sweetalert/swalvue'
Vue.use(swal)
import '@/plugins/element-ui'
import i18n from '@/i18n'

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')