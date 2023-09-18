import '@/plugins/bootstrap'
import '@/plugins/element-ui/index.js'
import swal from '@/plugins/sweetalert/swalvue'
import '@/validation'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './ItemBasicApp.vue'

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    state: {
        itemBasicList: [],
    },
    mutations: {
        setItemBasicList: (state, payload) => state.itemBasicList = payload,
    }
})

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
