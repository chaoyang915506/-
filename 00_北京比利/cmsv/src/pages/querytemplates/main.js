import Vue from 'vue'
import App from './QueryTemplatesApp.vue'
import ElementUI from '@/plugins/element-ui'
import i18n from '@/i18n'

new Vue({
  i18n,
  render:h=>h(App)
}).$mount('#app')