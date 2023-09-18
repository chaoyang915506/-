import Api from '@/api/Api'
import CastApi, { CastProxyServerApi } from '@/api/CastApi'
import RoomApi from '@/api/RoomApi'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import '@/validation'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './CastApp.vue'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);
Vue.use(swal);

const store = new Vuex.Store({
    state: {
        rooms: [],
        proxyServers: [],
        castDevices: [],
    },
    mutations: {
        setRooms: (state, payload) => state.rooms = payload,
        setProxyServers: (state, payload) => state.proxyServers = payload,
        setCastDevices: (state, payload) => state.castDevices = payload,
    },
    actions: {
        getCastDevices: context => {
            CastApi.list().then(data => {
                context.commit('setCastDevices', data.list)
            }).catch(err => console.error(err))
        },
        getProxyServers: ({ commit }) => {
            CastProxyServerApi.list().then(data => {
                commit('setProxyServers', data.list)
            }).catch(err => console.error(err))
        }
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([
            CastProxyServerApi.list(),
            CastApi.list(),
            RoomApi.list()
        ], (data, data1, data2) => {
            this.$store.commit('setProxyServers', data.list)
            this.$store.commit('setCastDevices', data1.list)
            this.$store.commit('setRooms', data2)
        }).catch(err => {
            console.log(err)

            this.$error('获取数据失败')
        })
    }
}).$mount('#app');
