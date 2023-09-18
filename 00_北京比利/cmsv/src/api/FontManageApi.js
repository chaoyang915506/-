
import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getlanguageApi () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  getfontController () {
    const url = env.cms + '/cms/cmsHotelFontController/gethotelfont?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  getGarden () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  //删除
  delfontmanage (id) {
    const url = env.cms + '/cms/cmsHotelFontController/delete?id=' + id
    return this.axios.get(url)

  }
  addfontApi (body) {
    // const url = env.cms + `/cms/cmsHotelFontController/add?hotelId=${env.hotelId}&style=${body.style}&weight=${body.weight}&formats=${body.formats}&langId=${body.langId}&fontFile=${body.fontFile}&fontDesc=${body.fontDesc}`
    const url = env.cms + `/cms/cmsHotelFontController/add`
    return this.axios.post(url, qs.stringify(body))
  }
  updateApi (body) {
    const url = env.cms + '/cms/cmsHotelFontController/update'
    return this.axios.post(url, qs.stringify(body))
  }
}