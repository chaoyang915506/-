import env from "@/env"
import Api from "./Api"
import Axios from 'axios'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部数据
  getAll () {
    // const url = env.cms + '/cms/guideVideo/list/all?hotelId='+env.hotelId+'&langId=0'
    const url = env.cms + '/cms/guideVideo/list/all?hotelId=' + env.hotelId + '&langId=0'
    return this.axios.get(url)
  }
  addData (body) {
    const url = env.cms + '/cms/guideVideo'
    return this.axios.post(url, body)
  }
  //所有的酒店
  allHotel () {
    const url = env.cms + '/cmsservice/hotelinfo/allinfo'
    return this.axios.get(url)
    // const url = 'https://tktv.tkhealthcare.com/cmsservice/hotelinfo/allinfo?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNeUNvb2xUViIsImlkIjoiMUEwQ0U1ODlBMTk5RTM2NDkyN0EwMTdFRTk2RjlGNkYiLCJleHAiOjE2MzEwMTk4NTMsInVzZXJOYW1lIjoic3VwZXIifQ._29deRD61tJtXrF7ub7SwXKYtNE5D7WffzkTx5nOPOA'
    // return Axios.get(url)
  }
  // 删除
  delGuiDanceV (id = []) {
    let url = env.cms + '/cms/guideVideo'
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }
  languageApi () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //引导开关
  guidanceStart (body) {
    const url = env.cms + '/cms/guideVideo/status?hotelId=' + env.hotelId + '&videoId=' + body.videoId + '&status=' + body.status
    return this.axios.put(url)
  }
}


