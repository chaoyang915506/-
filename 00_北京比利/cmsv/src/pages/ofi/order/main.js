import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './OfiOrderApp.vue'

Vue.use(Vuex)
Vue.use(swalvue)

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
    state: {
        ofiApi: {},
        orders: [],
    },
    mutations: {
        setOfiApi: (state, payload) => state.ofiApi = payload,
        setOrders: (state, payload) => state.orders = payload,
    },
})

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
