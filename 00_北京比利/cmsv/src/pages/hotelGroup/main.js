import Vue from 'vue'
import Vuex from 'vuex'
import App from './HotelGroupApp.vue'
import swal from '@/plugins/sweetalert/swalvue'
import '@/plugins/bootstrap'
import '@/validation'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(Vuex)
Vue.use(swal)

new Vue({
    render: h => h(App)
}).$mount('#app')
