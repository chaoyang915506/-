import env from "@/env"
import Api from "./Api"
import Axios from 'axios'
export default new class extends Api {
  constructor() {
    super()
  }
  getallCity () {
    const url = env.cms + '/cms/weather/getWeatherCityList?limit=9999&offset=0'
    return this.axios.get(url)
  }
  //tktv.tkhealthcare.com/cms/weather/addWeatherCity?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNeUNvb2xUViIsImlkIjoiQzA1MEU1OEY0RDE5QzFCOENCODc3N0U2M0EyNjE0QzgiLCJleHAiOjE2MzI2MzE0MjAsInVzZXJOYW1lIjoic3VwZXJfdGVzdCJ9.ptC2bC1j2nvNMHAYsfPIQtpGgD9UBiUlHQPXh1Fu2jY
  //成功添加
  //获取城市
  getcityName (cityName) {
    const url = env.cms + '/cms/weather/getWeatherCityInfo?cityId=' + cityName
    return this.axios.get(url)
  }
  //各国语言
  getlanguageAll () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
  //新增
  addWeather (body) {
    const url = env.cms + '/cms/weather/addWeatherCity'
    return this.axios.post(url, body)
    // const url ='https://tktv.tkhealthcare.com/cms/weather/addWeatherCity?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNeUNvb2xUViIsImlkIjoiNTBCNzNCNUU2N0Q3NERFMzcxQkMxOERDRUUxQ0VBOUQiLCJleHAiOjE2MzI3MjY1MjUsInVzZXJOYW1lIjoic3VwZXJfdGVzdCJ9.VeMsyxNrONpgUbV9-qwTMkX9nfaAztp6BQJAy4O9NJQ'
    // return Axios.post(url,body)
  }

  //编辑
  editWeather (body) {
    const url = env.cms + '/cms/weather/updateWeatherCity'
    return this.axios.post(url, body)
  }
  //多选启动
  allStart (body) {
    const url = env.cms + '/cms/weather/setWeatherCitiesEnable'
    return this.axios.post(url, body)
  }
  // 删除数据
  delListData (body) {
    const url = env.cms + '/cms/weather/deleteWeatherCities'
    return this.axios.post(url, body)
  }
}