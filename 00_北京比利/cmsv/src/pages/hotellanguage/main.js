import Vue from 'vue'
import App from './HotelLanguageApp.vue'
import "@/plugins/element-ui"
import i18n from '@/i18n'
import swal from '@/plugins/sweetalert/swalvue'
Vue.use(swal)

Vue.config.productionTip = process.env.NODE_ENV === "production"
Vue.config.devtools = process.env.NODE_ENV !== "production"

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')