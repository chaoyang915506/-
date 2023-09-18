import Api from './Api'
import env from '@/env/'
export default new class extends Api {
  constructor() {
    super()
  }
  getlanguage () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
}