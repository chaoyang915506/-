import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {

  constructor() {
    super()
  }
  //主页面的talbe 获取
  getTable (body) {
    const url = env.cms + "/cms/chargeStrategy/getByPage?" + qs.stringify(body)
    return this.axios.get(url)
  }
  //币种
  getAll () {
    const url = env.cms + "/cms/currency/getAll"
    return this.axios.get(url)
  }
  getAllFee () {
    const url = env.cms + '/cms/fee/getAllFee'
    return this.axios.get(url)
  }
  getlanguage () {
    const url = env.cms + '/cms/language/getLanguageList?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  addSubmit (body) {
    const url = env.cms + '/cms/chargeStrategy/add?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  getedit (id) {
    const url = env.cms + '/cms/chargeStrategy/getById?id=' + id
    return this.axios.get(url)
  }
  updatefrom (body) {
    const url = env.cms + '/cms/chargeStrategy/update?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  delete (id) {
    const url = env.cms + '/cms/chargeStrategy/deleteById?id=' + id + '&hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  deleteAll (ids) {
    const url = env.cms + '/cms/chargeStrategy/batchDel?hotelId=' + env.hotelId
    return this.axios.post(url, ids)
  }

  getCurrency (body) {
    const url = env.cms + '/cms/currency/getByPage?' + qs.stringify(body)
    return this.axios(url)
  }
  addCurrency (body) {
    const url = env.cms + '/cms/currency/add'
    return this.axios.post(url, body)
  }
  geteditCurrent (id) {
    const url = env.cms + '/cms/currency/getById?id=' + id
    return this.axios.get(url)
  }
  editCurrent (body) {
    const url = env.cms + '/cms/currency/update?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  delCurrent (id) {
    const url = env.cms + '/cms/currency/deleteById?id=' + id
    return this.axios.get(url)
  }
  getMoneyAll (body) {
    const url = env.cms + '/cms/fee/getAll?' + qs.stringify(body)
    return this.axios.get(url)
  }
  addMoney (body) {
    const url = env.cms + '/cms/fee/addFee'
    return this.axios.post(url, body)
  }
  deleteMoney (id) {
    const url = env.cms + '/cms/fee/delFeeById?id=' + id
    return this.axios.get(url)
  }
}
