import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部数据
  getAllDevice () {
    const url = env.cms + '/cms/deviceTypes'
    return this.axios.get(url)
  }
  // 新增
  addShowCount (body) {
    const url = env.cms + '/cms/deviceTypes'
    return this.axios.post(url, body)
  }
  //修改
  changedData (body) {
    const url = env.cms + '/cms/deviceTypes'
    return this.axios.put(url, body)
  }
  // 删除（可多个）
  delData (id = []) {
    let url = env.cms + '/cms/deviceTypes'
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }

}