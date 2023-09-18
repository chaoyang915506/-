import swal from '@/plugins/sweetalert'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './DeviceApp.vue'
import '@/plugins/bootstrap'
import RoomApi from '@/api/RoomApi'
import Api from '@/api/Api'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(swal)
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        rooms: [],
    },
    mutations: {
        setRooms: (s, p) => s.rooms = p,
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([RoomApi.list()], (data) => {
            this.$store.commit('setRooms', data.list)

        }).catch(err => {
            console.error(err)

            this.$error('获取数据失败')
        })
    }
}).$mount('#app')