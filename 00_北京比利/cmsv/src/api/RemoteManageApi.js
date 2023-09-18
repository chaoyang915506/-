import Api from './Api'
import env from '@/env'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  getTableData () {
    const url = env.cms + '/cms/remoter/getRemoterList'
    return this.axios.get(url)
  }

  addRomoter (body) {
    const url = env.cms + '/cms/remoter/addRemoter'
    return this.axios.post(url, body)
  }
  updateRemoter (body) {
    const url = env.cms + '/cms/remoter/updateRemoter'
    return this.axios.post(url, body)
  }
  delRemoter (id) {
    const url = env.cms + '/cms/remoter/delRemoter?id=' + id
    return this.axios.get(url)
  }
  getcmsKey () {
    const url = env.cms + '/cms/cmsKeyController/getAllBasicKey'
    return this.axios.get(url)
  }
  getRemoterKyes (id) {
    const url = env.cms + '/cms/remoter/getRemoterKeys?id=' + id
    return this.axios.get(url)
  }
  saveRemoterKeys (id, body) {
    const url = env.cms + '/cms/remoter/updateRemoterKey?id=' + id

    return this.axios.post(url, body)
  }
}