import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取版权分类
  getcopyright () {
    const url = env.cms + '/cms/v2/copyrightClasses'
    return this.axios.get(url)
  }
  //获取全部酒店
  getHotelList () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  //新增版权
  addcopyright (body) {
    const url = env.cms + '/cms/v2/copyrightClasses'
    return this.axios.post(url, body)
  }
  //编辑
  editcopyright (body) {
    const url = env.cms + '/cms/v2/copyrightClasses'
    return this.axios.put(url, body)
  }
  //删除
  delcopyright (id = []) {
    let url = env.cms + '/cms/v2/copyrightClasses'
    id.forEach((item, idx) => {
      if (idx == 0) {
        url += `?id=${item}`
      } else {
        url += `&id=${item}`
      }
    })
    return this.axios.delete(url)
  }
}