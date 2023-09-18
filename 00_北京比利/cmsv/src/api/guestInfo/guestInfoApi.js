import env from '@/env'
import Api from '../Api'
import Axios from 'axios'

export default new class extends Api {
  constructor() {
      super()
  }

  // 获取酒店所有房间
  getRoomListApi () {
    const url = env.cms + '/cms/cmsHotelRoomController/roomlist?hotelId=' + env.hotelId // env.hotelId
    return this.axios.get(url)
  }
  // 获取登记过的客人信息列表
  getGuestListApi () {
    const url = env.cms + '/cms/hotelGuest/list?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  // 更新客人信息
  updateGuestInfoApi (guestData) {
    const url = env.cms + '/cms/hotelGuest/update?hotelId=' + env.hotelId
    return this.axios.post(url, guestData)
  }
  // 添加客人信息
  addGuestInfoApi (infoData) {
    const url = env.cms + '/cms/hotelGuest/add?hotelId=' + env.hotelId
    return this.axios.post(url, infoData)
  }
  // 删除客人信息
  delGuestInfoApi (ids = []) {
    const url = env.cms + '/cms/hotelGuest/delete?hotelId=' + env.hotelId
    let res = ''
    ids.forEach(item => {
      res = res + 'ids[]=' + item + '&'
    })
    res = res.slice(0, res.length - 1)
    // console.log(res);
    return this.axios.post(url , res)
  }
  // 获取酒店语言
  getLangApi () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
}