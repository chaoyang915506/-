
// 导入 dayjs 的核心模块
import dayjs from 'dayjs'
import Vue from 'vue'
export function parseDate2Str (date, format) {
  format=format||"YYYY-MM-DD"
  return dayjs(date).format(format)
}
export function hourm (date, format) {
  format = format ||'YYYY-MM-DD HH:mm:ss'
}
Vue.prototype.dayjs=dayjs