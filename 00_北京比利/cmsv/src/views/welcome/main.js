import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import '@/validation'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './WelcomeApp.vue'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swal)

new Vue({
    render: h => h(App),
}).$mount('#app');