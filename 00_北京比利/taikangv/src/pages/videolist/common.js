
// 导入 dayjs 的核心模块
import dayjs from 'dayjs'
import Vue from 'vue'
export function parseDate2Str (date, format) {
  format = format || "YYYY-MM-DD"
  return dayjs(date).format(format)
}
export function hourm (date, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss'
}
Vue.prototype.dayjs = dayjs
Vue.directive('time', {
  inserted (el,binding) {
    if (binding.value > 0) {
      let hour = Math.floor(binding.value / 3600)
      let minute = Math.floor(binding.value % 3600 / 60)
      let second = Math.floor((binding.value - 60 * minute) % 60)
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = "0" + minute
      }
      if (second < 10) {
        second = "0" + second
      }
      console.log(hour + ':' + minute + ':' + second)
      let str = hour + ':' + minute + ':' + second
      return str
    }
  }
})