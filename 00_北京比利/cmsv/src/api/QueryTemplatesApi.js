import Api from './Api'
import env from '@/env'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getAllTemplate (body) {
    const url = env.cms + '/cms/templateController/queryTemplates?hotelId=' + env.hotelId + '&' + qs.stringify(body)
    return this.axios.get(url)
  }
  saveAddTemplate (body) {
    const url = env.cms + '/cms/templateController/saveAddTemplate?hotelId=' + env.hotelId
    return this.axios.post(url, qs.stringify(body))
  }
  deleteTemplate (body) {
    const url = env.cms + '/cms/templateController/deleteTemplateById?hotelId=' + env.hotelId
    return this.axios.post(url, qs.stringify(body))
  }
}