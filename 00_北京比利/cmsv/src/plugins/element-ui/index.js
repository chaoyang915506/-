import Vue from 'vue'
import ElementUI from 'element-ui'
import './theme/index.css'
import './theme-chalk.css'
import en from 'element-ui/lib/locale/lang/en'
import zh from 'element-ui/lib/locale/lang/zh-CN'
import env from '@/env'
let locale = zh
if (env.locale == "1") {
  locale = en
}

Vue.use(ElementUI, { size: 'medium', locale })
