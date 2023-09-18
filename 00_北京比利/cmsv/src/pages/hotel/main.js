import HotelApi from '@/api/HotelApi'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './HotelApp.vue'
import '@/validation'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    // state: {
    //     hotels: [],
    // },
    // mutations: {
    //     setHotels: (s, p) => s.hotels = p,
    // },
    // actions: {
    //     async getHotel (ctx) {
    //         try {
    //             const data = await HotelApi.list()
    //             ctx.commit('setHotels', data)
    //         } catch (error) {
    //             this.$error('读取酒店数据失败')
    //             console.log(error)
    //         }
    //     }
    // }
})

new Vue({
    store,
    render: h => h(App),
    // created () {
    //     this.$store.dispatch('getHotel')
        // HotelApi.list().then(data => {
        //     this.$store.commit('setHotels', data)
        // }).catch(err => {
        //     this.$error('读取酒店数据失败')

        //     console.error(err)
        // })
    // }
}).$mount('#app')
