import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  getHotelList () {
    const url = env.cms + '/cms/mainController/getAllHotels'
    return this.axios.get(url)
  }
  getRoomlist (hotelId) {
    const url = env.cms + '/cms/cmsHotelRoomController/roomlist?hotelId=' + hotelId
    return this.axios.get(url)
  }
  getDevicelist (hotelId) {
    const url = env.cms + '/cms/cmsDeviceController/devicelist?hotelId=' + hotelId
    return this.axios.get(url)
  }
  cmsDeviceMove (body) {
    const url = env.cms + `/cms/cmsDeviceController/move?oriHotelId=${body.oriHotelId}&dstHotelId=${body.dstHotelId}&oriRoomId=${body.oriRoomId}&dstRoomId=${body.dstRoomId}&deviceId=${body.deviceId}`
    return this.axios.get(url)
  }
}