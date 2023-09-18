import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  // 获取钱的
  getAllMoney () {
    const url = env.cms + '/cms/currency/getAll'
    return this.axios.get(url)
  }
  //获取菜单
  getBypage (langId= 0) {
  const url = env.cms + '/cms/hotelChargeItem/getByPage?offset=0&limit=999&hotelId=' + env.hotelId + '&langId=' + langId + '&metaType=9'
  return this.axios.get(url)
}
getlanguage() {
  const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
  return this.axios.post(url)
}
}