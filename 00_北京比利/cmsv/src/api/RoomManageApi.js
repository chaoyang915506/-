import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getHotelRoom () {
    const url = env.cms + '/cms/cmsHotelRoomController/hotelroomlist?limit=9999&offset=0&hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  updateRoom (body) {
    const url = env.cms + 'cmsHotelRoomController/update'
    return this.axios.post(url, body)
  }
  addRoom (body) {
    const url = env.cms + '/cms/cmsHotelRoomController/add'
    return this.axios.post(url, qs.stringify(body))
  }
  deleteHotelRoom (roomId) {
    const url = env.cms + '/cms/cmsHotelRoomController/deleteHotelRoom?hotelId=' + env.hotelId + '&roomId=' + roomId
    return this.axios.get(url)
  }
  deleteAllRoom (body) {
    const url = env.cms + '/cms/cmsHotelRoomController/batchDeleteHotelRoom'
    return this.axios.post(url, body)
  }
}