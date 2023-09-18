import Vue from 'vue'
import Vuex from 'vuex'
import App from './LaundryClassApp.vue'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swalvue)

new Vue({
    render: h => h(App)
}).$mount('#app')