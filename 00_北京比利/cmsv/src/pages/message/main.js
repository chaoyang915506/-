import Api from '@/api/Api'
import GuestGroupApi from '@/api/GuestGroupApi'
import LangApi from '@/api/LangApi'
import RoomApi from '@/api/RoomApi'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import '@/validation'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './MessageApp.vue'
import '@/assets/css/public.scss'
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swalvue)

const store = new Vuex.Store({
    state: {
        langs: [],
        rooms: [],
        guestGroups: [],
    },
    mutations: {
        setLangs: (state, payload) => state.langs = payload,
        setRooms: (state, payload) => state.rooms = payload,
        setGuestGroups: (state, payload) => state.guestGroups = payload,
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([
            LangApi.list(),
            RoomApi.list(),
            GuestGroupApi.list()
        ], (data, data1, data2) => {
            this.$store.commit('setLangs', data)
            this.$store.commit('setRooms', data1)
            this.$store.commit('setGuestGroups', data2.list)
        })
    }
}).$mount('#app')
