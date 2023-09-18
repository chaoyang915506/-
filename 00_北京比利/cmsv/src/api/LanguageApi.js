import env from "@/env"
import Axios from "axios"
import Api from "./Api"
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部语言
  getShowCount () {
    const url = env.cms + '/cms/language/getLanguagePageList?limit=9999&offset=0'
    return this.axios.post(url)
  }
  //全部数据
  getalllanguage () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
  // 新增
  addShowCount (body) {
    const url = env.cms + '/cms/language/addLanguage'
    return this.axios.post(url, body)
  }
  //修改
  changedData (body) {
    const url = env.cms + '/cms/language/updateLanguage'
    return this.axios.post(url, body)
  }
}
