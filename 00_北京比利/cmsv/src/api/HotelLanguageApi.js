import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  // 获取全部数据
  getAllTable (page) {
    const url = env.cms + '/cms/hotelLang/getHotelLangList?' + qs.stringify(page)
    return this.axios.get(url)
  }
  // 获取全部酒店
  getHotel () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.post(url)
  }
  //获取全部语言
  getLanuage () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.post(url)
  }
  //新增酒店标签
  addhotelLang (body) {
    const url = env.cms + '/cms/hotelLang/addHotelLang'
    return this.axios.post(url, body)
  }
  //编辑酒店标签
  edithotelLang (body) {
    const url = env.cms + '/cms/hotelLang/updateHotelLang'
    return this.axios.post(url, body)
  }
  //删除
  delAllhoelLang (body) {
    const url = env.cms + '/cms/hotelLang/batchDelete'
    return this.axios.post(url, body)
  }
}