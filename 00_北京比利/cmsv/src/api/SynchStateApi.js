import Api from './Api'
import env from '@/env'
import Axios from 'axios'
export default new class extends Api {
  constructor() {
    super()
  }
  getAllTable () {
    const url = env.cms + '/cms/epgSync/getByPage?offset=0&limit=9999'
    return this.axios.get(url)
  }

  issuceApi () {
    const url = env.cms + '/cms/epgSync/doSync'
    return this.axios.get(url)
  }
}