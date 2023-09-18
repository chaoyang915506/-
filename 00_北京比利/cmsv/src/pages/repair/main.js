import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import App from './RepairApp.vue'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production' 

Vue.use(Vuex)
Vue.use(swalvue)

const app = new Vue({
    render: h =>h(App)
})
app.$mount('#app')