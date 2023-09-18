import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './GroupGuest.vue'
import '@/validation'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')


import elementUI from 'element-ui';

Vue.use(elementUI);
Vue.prototype.$moment = moment
Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({})


new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
