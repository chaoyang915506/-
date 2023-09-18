import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部数据
  getTableData () {
    const url = env.cms + '/cms/area/getAreaByCondition?limit=9999&offset=0'
    return this.axios.get(url)
  }
  // 新增
  addTable (body) {
    const url = env.cms + '/cms/area/addArea'
    return this.axios.post(url, body)
  }
  // 编辑
  editTable (body) {
    const url = env.cms + '/cms/area/updateArea'
    return this.axios.post(url, body)
  }
  //删除
  deleteTable (body) {
    const url = env.cms + '/cms/area/deleteAreaByIdList'
    return this.axios.post(url, body)
  }
  //获取省份
  getprovince (id) {
    const url = env.cms + '/cms/area/getAreaById?areaId=' + id 
    return this.axios.get(url)

  }
  //获取转入的的位置
  getAreaChildren (id) {
    const url = env.cms + '/cms/area/getAreaChildren?areaId=' + id 
    return this.axios.get(url)
  }
  //全部省份的数据
  getAllprovince () {
    const url = env.cms + '/cms/area/getAll'
    return this.axios.get(url)
  }
  // 管理子区域保存
  Managesavecontent (body) {
    const url = env.cms + '/cms/area/addAreaChildren'
    return this.axios.post(url, body)
  }
  //获取全部城市
  getAllCity () {
    const url = env.cms + '/cms/city/getAll'
    return this.axios.get(url)
  }
  // 获取剩余城市
  residueCity (id) {
    const url = env.cms + '/cms/area/getAreaCity?areaId=' + id + ''
    return this.axios.get(url)
  }
  //合并城市
  mergeCity (body) {
    const url = env.cms + '/cms/area/addAreaCity'
    return this.axios.post(url, body)
  }
}