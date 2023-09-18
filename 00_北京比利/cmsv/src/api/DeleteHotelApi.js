import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  getTableData () {
    const url = env.cms + '/cms/mainController/getHotelList?offset=0&limit=9999'
    return this.axios.get(url)
  }
  delteHotel (id) {
    const url =env.cms+'/cms/mainController/deleteHotelById?hotelId='+id
    return this.axios.get(url)
  }
}