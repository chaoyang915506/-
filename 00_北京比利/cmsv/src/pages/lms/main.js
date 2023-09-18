import '@/plugins/bootstrap/index'
import swal from '@/plugins/sweetalert/swalvue'
import Vue from 'vue'
import App from './LmsApp.vue'

import i18n from '@/i18n'
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(swal)

new Vue({
    i18n,
    render: h => h(App)
}).$mount('#app')