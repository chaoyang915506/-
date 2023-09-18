import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取展示内容
  getShowCount () {
    const url = env.cms + '/cms/gallery/exhibitions'
    return this.axios.get(url)
  }
  // 新增
  addShowCount (body) {
    const url = env.cms + '/cms/gallery/exhibitions'
    return this.axios.post(url, body)
  }
  //修改
  changedData (body) {
    const url = env.cms + '/cms/gallery/exhibitions'
    return this.axios.put(url, body)
  }
  // 删除（可多个）
  delData (id = []) {
    let url = env.cms + '/cms/gallery/exhibitions'
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }
  //获取各个园的数据--
  getdata () {
    const url = env.cmsservice + '/cmsservice/hotelinfo/allinfo'
    return this.axios.get(url)
    //开发环境
    // const url = 'https://cmsservice.dev.mycool.tv/cmsservice/hotelinfo/allinfo'
    // return Axios.get(url)
  }
  //排序
  sortData (body) {
    const url = env.cms + '/cms/gallery/exhibitions/sort'
    return this.axios.put(url, body)
  }

   //获取背景图
   getupdata () {
    const url = 'https://tktv.tkhealthcare.com/cmsservice/gallery/background'
    return Axios.get(url)
    // const url = env.cms + '/cms/gallery/background'
    // return this.axios.get(url)
  }
}