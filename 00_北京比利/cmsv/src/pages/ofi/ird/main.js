import HotelApi from '@/api/HotelApi'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import Vue from 'vue'
import Vuex from 'vuex'
import OfiApi from '../OfiApi'
import App from './ContactApp.vue'

Vue.use(Vuex)
Vue.use(swalvue)

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
    state: {
        contacts: [],
    },
    mutations: {
        setContacts: (state, payload) => state.contacts = payload,
    },
})

new Vue({
    store,
    render: h => h(App),
    created() {
        OfiApi.contacts().then(data => {
            this.$store.commit('setContacts', data.list);
        }).catch(err => {
            this.$error(err)
        })
    }
}).$mount('#app');