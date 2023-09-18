import Vue from 'vue'
import Vuex from 'vuex'
import App from './SwitchRelayApp.vue'
import '@/plugins/bootstrap'
import '@/validation'
import swal from '@/plugins/sweetalert/swalvue'
import Api from '@/api/Api'
import CastApi, { CastSwitchRelayApi } from '@/api/CastApi'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    state: {
        relays: [],
        castDevices: [],
    },
    mutations: {
        setRelays: (state, payload) => state.relays = payload,
        setCastDevices: (state, payload) => state.castDevices = payload,
    },
    actions: {
        getRelays: ({ commit }) => {
            CastSwitchRelayApi.list().then(data => commit('setRelays', data.list))
                .catch(err => {
                    console.log(err)
                })
        }
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([
            CastSwitchRelayApi.list(),
            CastApi.list()
        ], (data, data1) => {
            this.$store.commit('setRelays', data.list)
            this.$store.commit('setCastDevices', data1.list)
        }).catch(err => {
            console.log(err)

            this.$error('获取数据错误')
        })
    }
}).$mount('#app')
