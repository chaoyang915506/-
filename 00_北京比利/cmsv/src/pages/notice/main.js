import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './NoticeApp.vue'
import '@/validation'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.prototype.$moment = moment

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})

new Vue({
  store,
  render: h => h(App)

}).$mount('#app')