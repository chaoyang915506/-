import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getByPage (body) {
    const url = env.cms + '/cms/hotelAirportAirline/getByPage?hotelId=' + env.hotelId + '&' + qs.stringify(body)
    return this.axios.get(url)
  }
  hotelLang () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  getInclude () {
    const url = env.cms + '/cms/hotelAirport/getInclude?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  airline () {
    const url = env.cms + '/cms/airline/getAll?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  batchDel (id) {
    const url = env.cms + '/cms/hotelAirportAirline/batchDel'
    return this.axios.post(url, { ids: id })
  }
  deleteById (id) {
    const url = env.cms + '/cms/hotelAirportAirline/deleteById?id=' + id
    return this.axios.get(url)
  }
  getHotelList () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  update (body) {
    const url = env.cms + '/cms/hotelAirportAirline/update?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  getExcAirline (body) {
    const url = env.cms + '/cms/hotelAirportAirline/getExcAirline?hotelId=' + env.hotelId + '&' + qs.stringify(body)
    return this.axios.get(url)
  }
  getIncAirline (body) {
    const url = env.cms + '/cms/hotelAirportAirline/getIncAirline?hotelId=' + env.hotelId + '&' + qs.stringify(body)
    return this.axios.get(url)
  }
  addOrEditAirline (body, data) {
    const url = env.cms + '/cms/hotelAirportAirline/addOrEditAirline?' + qs.stringify(data)
    return this.axios.post(url, body)
  }
  batchDelAndSave (body) {
    const url = env.cms + '/cms/hotelAirportAirline/batchDelAndSave?hotelId=' + env.hotelId
    return this.axios.post(url, { list: body })
  }
  getByPageAirport (body) {
    const url = env.cms + '/cms/hotelAirport/getByPage?hotelId=' + env.hotelId + '&' + qs.stringify(body)
    return this.axios.get(url)
  }
  dellist (id) {
    const url = env.cms + '/cms/hotelAirport/del?hotelId=' + env.hotelId + '&airportId=' + id
    return this.axios.get(url)
  }
  dellistAll (ids) {
    const url = env.cms + '/cms/hotelAirport/batchDel?hotelId=' + env.hotelId
    return this.axios.post(url, { airportIds: ids, hotelId: env.hotelId })
  }
  getExclusive () {
    const url = env.cms + '/cms/hotelAirport/getExclusive?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  delAndSave (body) {
    const url = env.cms + '/cms/hotelAirport/delAndSave?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
}