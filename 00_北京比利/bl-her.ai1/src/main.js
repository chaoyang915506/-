import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.scss'

import 'amfe-flexible/index.js'

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preload: 1.3,
  // loading: require('../static/imgs/ad3.png'),
  // 解释一下为什么是require('.....url'):因为vue自带webpack打包工具，如果是图片路径就会把他当成模块解析，所以直接引入就好了。
  // 记得把里面的路径换成自己的哦
  listenEvents: ['mousewheel']
})

// console.log(window.screen, 'log')
window.addEventListener(
  'scroll', function (e) {
    const showNav = document.getElementById('home').offsetHeight - window.scrollY < this.document.getElementsByClassName('maxfixednav')[0].offsetTop
    if (showNav) {
      this.document.getElementsByClassName('maxfixednav')[0].style.display = 'block'
    } else {
      this.document.getElementsByClassName('maxfixednav')[0].style.display = 'none'
    }
  }
)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
