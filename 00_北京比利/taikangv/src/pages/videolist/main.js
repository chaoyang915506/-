import App from './VideoListApp.vue'
import Vue from 'vue'
import 'bootstrap';
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import uploader from 'vue-simple-uploader'
 Vue.use(uploader)
Vue.use(swal);
new Vue({
 render: h => h(App),
}).$mount('#app')