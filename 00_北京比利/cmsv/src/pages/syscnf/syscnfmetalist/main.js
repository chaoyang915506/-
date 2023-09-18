import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert/swalvue'
import App from './syscnfMetaListApp.vue'
import '@/validation'


// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(Select)



// import 'vue-multiselect/dist/vue-multiselect.min.css'
// import 'bootstrap-select'
// import bootstrapSelect from 'bootstrap-select'
// import 'bootstrap-select/sass/bootstrap-select.scss'
// Vue.use(bootstrapSelect)

Vue.use(swal)
Vue.use(Vuex)
const store = new Vuex.Store({

})

new Vue({
  store,
  render: h => h(App)

}).$mount('#app')