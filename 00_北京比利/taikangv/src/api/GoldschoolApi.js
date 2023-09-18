import env from '@/env'
import Api from './Api'
export default new class extends Api {
  constructor() {
    super()
  }
  //全部的数据
  alldata () {
    const url = `${env.taikang}/taikang/api/lecture/video/list/all`
    return this.axios.get(url)
  }
  //上传视频信息接口
  uploadVideo (body) {
    const url = `${env.taikang}/taikang/api/lecture/video/upload`
    return this.axios.post(url, body)
  }
  //手动添加视频信息V
  handUpdate (body) {
    const url = `${env.taikang}/taikang/api/lecture/video/add`
    return this.axios.post(url, body)
  }
  //删除数据
  deldata (id = []) {
    let url = `${env.taikang}/taikang/api/lecture/video/delete`
    id.forEach(id => url += '&id=' + id)
    const index = url.indexOf('&')
    const arr = url.split('')
    arr.splice(index, 1, '?')
    url = arr.join('')
    return this.axios.post(url)
  }
  //导出excel
  // exportExcel () {
  //   const url = `${env.taikang}/taikang/api/lecture/video/export`
  //   return Axios.get(url)
  // }
  //导入excel
  importExcel () {
    const url = `${env.taikang}/taikang/api/lecture/video/upload`
    return this.axios.post(url)
  }
  // //获取全部的视频数据
  // getVideo () {
  //   const url = env.taikang + '/taikang/backend/videoMedia'
  //   return this.axios.get(url)
  // }
  // //删除视频数据
  // delVideo (id = []) {
  //   let url = env.taikang + '/taikang/backend/videoMedia'
  //   id.forEach(id => url += '&id=' + id)
  //   let index = url.indexOf('&')
  //   let arr = url.split('')
  //   arr.splice(index, 1, '?')
  //   url = arr.join('')
  //   return this.axios.delete(url)
  // }
  // //修改视频数据
  // editVideo (body) {
  //   const url = env.taikang + '/taikang/backend/videoMedia'
  //   return this.axios.put(url, body)
  // }
}