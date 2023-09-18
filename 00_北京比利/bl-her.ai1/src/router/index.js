
import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/PcView.vue'
import mindex from '../views/MobileView.vue'
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    components: {
      default: index,
      pc: index,
      m: mindex
    }
  }]
})
