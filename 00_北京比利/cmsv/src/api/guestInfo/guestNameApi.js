import env from '@/env'
import Api from '../Api'
import Axios from 'axios'

export default new class extends Api {
  constructor() {
      super()
  }

  // 获取客人
  getGuestListApi () {
    const url = env.ims + '/ims/guestCfg/getGuestCfg?hotelId=' + env.hotelId // env.hotelId
    return this.axios.get(url)
  }
  // 修改客人信息显示（姓名显示、姓名来源）
  // 传的参数格式：{"oList":[{"nameSource":"1","roomNumber":"10011","showGuestName":1}]}
  changeGuestApi (guestCfg) {
    const url = env.ims + '/ims/guestCfg/setGuestCfg?hotelId=' + env.hotelId
    return this.axios.post(url, guestCfg)
  }
}