import App from './GoldschoolApp.vue'
import Vue from 'vue'
import 'bootstrap';
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import uploader from 'vue-simple-uploader'
 Vue.use(uploader)
Vue.filter('today', () => {
  return '今天'
})
Vue.use(swal);
new Vue({
 render: h => h(App),
}).$mount('#app')