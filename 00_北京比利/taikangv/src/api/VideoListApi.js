import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //获取全部的视频数据
  getVideo () {
    const url = env.taikang + '/taikang/backend/videoMedia'
    return this.axios.get(url)
  }
  //删除视频数据
  delVideo (id = []) {
    let url = env.taikang + '/taikang/backend/videoMedia'
    id.forEach(id => url += '&id=' + id)
    let index = url.indexOf('&')
    let arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.delete(url)
  }
  //修改视频数据
  editVideo (body) {
    const url = env.taikang + '/taikang/backend/videoMedia'
    return this.axios.put(url, body)
  }
}