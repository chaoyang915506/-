import Api from "./Api"
import env from "@/env"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取园区
  getGarden () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  //获取基础按键数据
  getbasicsKeyList () {
    const url = env.cms + '/cms/cmsKeyController/getAllBasicKey'
    return this.axios.get(url)
  }
  //获取基础栏目数据
  getSelectCount () {
    const url = env.cms + '/cms/cmsItemBasicController/selectAllEnable'
    return this.axios.get(url)
  }
  // 获取首页列表数据
  getTableData () {
    const url = env.cms + "/cms/cmsHotelKeyController/getAllHotelKey?offset=0&limit=9999&hotelId=" + env.hotelId
    return this.axios.get(url)
  }
  //新增
  addhotel (body) {
    const url = env.cms + '/cms/cmsHotelKeyController/add?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  //编辑
  editupdate (body) {
    const url = env.cms + '/cms/cmsHotelKeyController/update?hotelId='+env.hotelId
    return this.axios.post(url, body)
  }
  //删除
  deleteDate (id = []) {
    let url = env.cms + '/cms/cmsHotelKeyController/deleteByPrimaryKey?hotelId=' + env.hotelId
    id.forEach(idx => url += '&id=' + idx)
    return this.axios.get(url)
  }
  //删除多个
  deleteAll (body) {
    const url = env.cms + '/cms/cmsHotelKeyController/batchDelete?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  //获取编辑数据
  geteditdata (id) {
    const url = env.cms + '/cms/cmsKeyController/getById?id=' + id
    return this.axios.get(url)
  }
  //获取全部的语言
  getlanguage () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
  //新增key
  addkey (body) {
    const url = env.cms + '/cms/cmsKeyController/add'
    return this.axios.post(url, body)
  }
  //编辑key
  deitkey (body) {
    const url = env.cms + '/cms/cmsKeyController/update'
    return this.axios.post(url, body)
  }
  //删除一个按键
  deletekey (id) {
    const url = env.cms + '/cms/cmsKeyController/deleteByPrimaryKey?id=' + id
   

    return this.axios.get(url)
  }
  //删除多个按键
  deletAllkey (body) {
    const url = env.cms + '/cms/cmsKeyController/batchDelete'
    return this.axios.post(url, body)
  }
}