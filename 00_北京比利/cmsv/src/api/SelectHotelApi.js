import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部数据
  getdata () {
    const url = env.cmsservice + '/cmsservice/hotelinfo/allinfo'
    return this.axios.get(url)
    //开发环境
    // const url = 'https://tktv.tkhealthcare.com/cmsservice.dev.mycool.tv/cmsservice/hotelinfo/allinfo'
    // return Axios.get(url)
  }
  mergeHotelApi (body) {
    const url = env.cms + `/cms/weather/batchAdd?sourceHotelId=${body.sourceHotelId}&destHotelId=${body.destHotelId}`
    return this.axios.post(url)
  }


}