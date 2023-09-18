import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取语言
  getlanguage () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //获取团
  getguest () {
    const url = env.cms + '/groupGuestController/hotelGuestGroup?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //获取房间
  getroomId () {
    const url = env.cms + '/cms/cmsHotelRoomController/gethotelroomlist?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  getTableData () {
    const url = env.cms + '/cms/message/getMessage?offset=0&limit=9999&msgType=1&relType=&groupGuestId=0&hotelId='+env.hotelId
    return this.axios.get(url)
  }
}