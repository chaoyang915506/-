import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './LanguageApp.vue'
import '@/validation'

import 'vue-bootstrap-selectpicker/dist/css/vue-bootstrap-selectpicker.min.css'
import SelectPicker from 'vue-bootstrap-selectpicker'

Vue.use(SelectPicker)
Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({
})


new Vue({
    store,
    render: h => h(App),
    // created () {
    //     GalleryApi.getdata().then(data => {
    //         this.$store.commit('setGraden', data.list)
    //     }).catch(err => {
    //         // console.log(err)
    //         this.$error('获取数据失败')
    //     })
    // }
}).$mount('#app')
