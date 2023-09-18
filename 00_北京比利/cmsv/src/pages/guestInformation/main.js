import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import App from './guestInfoApp.vue'
import swal from '@/plugins/sweetalert/swalvue'
import '@/validation'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import elementUI from 'element-ui';
import i18n from '@/i18n'

Vue.use(elementUI);
Vue.prototype.$moment = moment
Vue.use(Vuex)
Vue.use(swal)

const store = new Vuex.Store({})

new Vue({
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')
