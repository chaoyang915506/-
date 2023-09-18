import Api from '@/api/Api'
import CmsApi from '@/api/CmsApi'
import WebcastApi from '@/api/WebcastApi'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './WebcastApp.vue'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    state: {
        hotels: [],
        limits: [],
    },
    mutations: {
        setLimits: (s, p) => s.limits = p,
        setHotels: (s, p) => s.hotels = p,
    }
})

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([CmsApi.hotels(), WebcastApi.limits()],
                (data, data1) => {console.log(data1.list);
                    this.$store.commit('setHotels', data.list)
                    this.$store.commit('setLimits', data1.list)
                })
            .catch(err => {
                console.error(err)
                this.$error('获取数据失败')
            })
    }
}).$mount('#app')