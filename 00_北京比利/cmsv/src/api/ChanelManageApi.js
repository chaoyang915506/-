import Api from './Api'
import env from '@/env'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getallTable (source = '') {
    const url = env.cms + '/cms/cmsEpg/getByPage?offset=0&limit=9999&code=&epgChannelCode=&epgName=&source=' + source
    return this.axios.get(url)
  }
  addepgApi (body) {
    const url = env.cms + '/cms/cmsEpg/add'
    return this.axios.post(url, body)
  }
  editepgApi (body) {
    const url = env.cms + '/cms/cmsEpg/update'
    return this.axios.post(url, body)
  }
  delepgApi (id) {
    const url = env.cms + '/cms/cmsEpg/deleteById?id=' + id
    return this.axios.get(url)
  }
  delepgAllApi (body) {
    const url = env.cms + '/cms/cmsEpg/batchDel'
    return this.axios.post(url, body)
  }
  // uploadApi (body) {
  //   const url = env.cms + '/cms/cmsEpg/importEpgChannel'
  //   return this.axios.post(url, { list: body })
  // }
  exportApi () {
    const url = env.cms + '/cms/cmsEpg/getAll?code=&epgChannelCode=&epgName='
    return this.axios.get(url)
  }
}
