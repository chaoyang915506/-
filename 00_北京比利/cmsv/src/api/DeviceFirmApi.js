import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  // 新增
  addShowCount (body) {
    const url = env.cms + '/cms/deviceVendors'
    return this.axios.post(url, body)
  }
  //修改
  changedData (body) {
    const url = env.cms + '/cms/deviceVendors'
    return this.axios.put(url, body)
  }
  // 删除（可多个）
  delData (id = []) {
    let url = env.cms + '/cms/deviceVendors'
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }
  // 获取厂商列表
  getfirm () {
    const url = env.cms + '/cms/deviceVendors'
    return this.axios.get(url)
  }
}