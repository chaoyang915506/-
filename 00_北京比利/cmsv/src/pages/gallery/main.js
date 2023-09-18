import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './GalleryApp.vue'
import '@/validation'

import GalleryApi from '@/api/GalleryApi'
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
    state: {
        graden: [],
    },
    mutations: {
        setGraden: (s, p) => s.graden = p,
    }
})


new Vue({
    store,
    render: h => h(App),
    created () {
        GalleryApi.getdata().then(data => {
            this.$store.commit('setGraden', data.list)
        }).catch(err => {
            // console.log(err)
            this.$error('获取数据失败')
        })
    }
}).$mount('#app')
