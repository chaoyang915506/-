import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import App from './NoticeApp.vue'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    state: {}
})

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')