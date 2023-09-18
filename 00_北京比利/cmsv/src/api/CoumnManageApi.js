import Api from './Api'
import env from '@/env'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取基础栏目
  getAllBasicList () {
    const url = env.cms + '/cms/cmsItemBasicController/getAll?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //获取两种语言
  getlangagelist () {
    const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  // 获取table数据
  getTableData (langId) {
    const url = env.cms + '/cms/cmsItemHotelController/getItemStructByLang?hotelId=' + env.hotelId + '&langId=' + langId
    return this.axios.get(url)
  }
  //切换状态
  setItemStatus (body) {
    const url = env.cms + '/cms/cmsItemHotelController/setItemStatus?hotelId=' + env.hotelId + '&itemBasicId=' + body.itemBasicId + '&status=' + body.status
    return this.axios.get(url)
  }
  //删除栏目
  delColumnApi (itemBasicId) {
    const url = env.cms + '/cms/cmsItemHotelController/delItemByBasicId?hotelId=' + env.hotelId + '&itemBasicId=' + itemBasicId
    return this.axios.get(url)
  }
  //拖拽排序
  itemlistSort (itemBasicId = []) {
    let url = env.cms + '/cms/cmsItemHotelController/sortItem?hotelId=' + env.hotelId
    itemBasicId.forEach(itemBasicIds => url += encodeURI(`&itemBasicIds[]=${itemBasicIds}`))
    return this.axios.post(url)
  }

  // /cms/cmsItemHotelController/getUnusedBasicItems
  //基础栏目
  getUnusedBasicItems () {
    const url = env.cms + '/cms/cmsItemHotelController/getUnusedBasicItems?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
  //新增顶级栏目（保存）
  batchAddItems (body) {
    const url = env.cms + '/cms/cmsItemHotelController/batchAddItems?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  //非顶级和编辑的查数据
  getItemByBasicId (itemBasicId) {
    const url = env.cms + '/cms/cmsItemHotelController/getItemsByBasicId?hotelId='+env.hotelId+'&itemBasicId=' + itemBasicId
    return this.axios.get(url)
  }
  //编辑成功
  batchUpdateItem (body) {
    const url = env.cms + '/cms/cmsItemHotelController/batchUpdateItems?hotelId=' + env.hotelId
    return this.axios.post(url, body)
  }
  //查以选中的栏目接口做了选后删除的操作
  itemBasicIdOne (itemBasicId) {
    const url = env.cms + '/cms/cmsItemHotelController/queryItemBasicById?itemBasicId=' + itemBasicId
    return this.axios.get(url)
  }
  getcolumnAllName () {
    const url = env.cms + '/cms/cmsItemHotelController/getItemByLang?hotelId=' + env.hotelId
    return this.axios.get(url)
  }
}