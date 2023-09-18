import Api from './Api'
import env from '@/env'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  //新增
  addmediaTypes (body) {
    const url = env.cms + '/cms/v2/mediaTypes'
    return this.axios.post(url, body)
  }
  //更新
  updatemediaTypes (body) {
    const url = env.cms + '/cms/v2/mediaTypes'
    return this.axios.put(url, body)
  }
  //删除
  deletemediaTypes (ids = []) {
    let url = env.cms + '/cms/v2/mediaTypes?' + qs.stringify({ id: ids }, { arrayFormat: 'repeat' })
    return this.axios.delete(url)
  }
  movicetypesort (body) {
    const url = env.cms + '/cms/v2/mediaTypes/sort'
    return this.axios.put(url, body)
  }
  movicesort (body, id) {
    const url = env.cms + '/cms/v2/medias/sort?mediaTypeId=' + id
    return this.axios.put(url, body)
  }
}