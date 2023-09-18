import Api from './Api'
import env from "@/env"
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()

  }
  getlistApi () {
    const url = env.cms + '/cms/notice'
    return this.axios.get(url)
  }
  //新增、编辑
  addlistApi (body) {
    const url = env.cms + '/cms/notice'
    return this.axios.post(url, body)
  }
  dellistApi (id = []) {
    let url = env.cms + '/cms/notice'
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }
  //获取酒店下的全部语言
  getHoteLang () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //全部公告
  getAllData () {
    const url = env.cms + '/cms/notices?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  // 创建
  addFormData (notice) {
    const url = env.cms + '/cms/notices?groupGuestId=' + notice.group + '&hotelId=' + env.hotelId
    return this.axios.post(url, notice.list)
  }
  //修改
  updateFormData (notice) {
    const url = env.cms + '/cms/notices'
    return this.axios.put(url, notice)
  }
  //获取全部的分组名称
  getAllGuest () {
    const url = env.cms + '/cms/groupGuestController/queryGroupGuest?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //获取无公告的分组
  getpartGuest () {
    const url = env.cms + '/cms/notices/group?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  // 修改样式
  // updataState (body) {
  //   const url = env.cms + '/cms/notices/updateMsgSelective'
  //   return this.axios.post(url, body)
  // }
  //删除
  deldataFrom (body) {
    let url = env.cms + '/cms/notices?hotelId=' + env.hotelId + '&' + qs.stringify({ msgIds: body }, { arrayFormat: 'repeat' })
    return this.axios.delete(url)
  }
}