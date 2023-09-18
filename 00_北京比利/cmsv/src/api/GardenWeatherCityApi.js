import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取园区数据
  getHotelLangList () {
    // ?limit=15&offset=0
    const url = env.cms + '/cms/weather/getHotelWeatherCityList?limit=9999&offset=0'
    return this.axios.get(url)
  }
  //语言
  language () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
  //获取城市
  getcity () {
    const url = env.cms + '/cms/city/getAll'
    return this.axios.get(url)
  }
  //获取园区
  getHotelListApi () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  //新增数据
  addFormData (body) {
    const url = env.cms + '/cms/weather/addHotelWeatherCity'
    return this.axios.post(url, body)
  }
  //修改数据
  updateHotel (body) {
    const url = env.cms + '/cms/weather/updateHotelWeatherCity'
    return this.axios.post(url, body)
  }
  //删除数据
  deltelHotel (body) {
    const url = env.cms + '/cms/weather/deleteHotelWeatherCities'
    return this.axios.post(url, body)
  }
  //获取图标管理的数据
  iconmanager (body) {
    const url = env.cms + '/cms/weather/getByIds'
    return this.axios.post(url, body)
  }
  // 更新图标
  updatemanager (body) {
    const url = env.cms + '/cms/weather/updateIcon'
    return this.axios.put(url, body)
  }






}