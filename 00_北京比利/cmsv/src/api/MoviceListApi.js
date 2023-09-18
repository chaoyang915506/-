import Api from './Api'
import env from '@/env'
export default new class extends Api {
  constructor() {
    super()
  }

  // //获取全部云端列表
  // getTableMedia () {
  //   const url = env.cms + '/cms/v2/medias?offset=0&limit=9999&metaType=14'
  //   return this.axios.get(url)
  // }
  // 获取语言
  getlanguage () {
    const url = env.cms + '/cms/language/getLanguageList'
    return this.axios.get(url)
  }
  //获取版权分组
  getcopyright () {
    const url = env.cms + '/cms/v2/copyrightClasses'
    return this.axios.get(url)
  }
  //获取全部酒店
  getHotelList () {
    const url = env.cms + '/cms/cmsHotelController/getHotelList'
    return this.axios.get(url)
  }
  // //获取全部电影分类
  getMoviceClass () {
    const url = `${env.cms}/cms/v2/mediaTypes?metaType=14&offset=0&limit=9999`
    return this.axios.get(url)
  }
  //获取区域位置
  getcopyrightpost () {
    const url = env.cms + '/cms/area/getAreaByCondition?limit=9999&offset=0'
    return this.axios.get(url)
  }
  //下发
  mediasSync (body) {
    const url = env.cms + '/cms/v2/medias/sync'
    return this.axios.post(url, body)
  }
  // 下发状态
  issueState (classid = '') {
    const url = env.cms + `/cms/v2/copyrightClasses/${classid}/synStatus`
    return this.axios.get(url)
  }
  //查看状态不成功删除酒店
  deleteHotelasyc (id) {
    const url = env.sync + '/sync/v1/tasks?id=' + id
    return this.axios.delete(url,)
  }
  //上线
  batchOnline (id = []) {
    let url = env.cms + '/cms/cmsMovieController/batchOnline'
    id.forEach((ids, index) => {
      if (index == 0) {
        url += encodeURI(`?ids[]=${ids}`)
      } else {
        url += encodeURI(`&ids[]=${ids}`)
      }
    })
    return this.axios.post(url)
  }
  //下线
  batchOffline (id = []) {
    let url = env.cms + '/cms/cmsMovieController/batchOffline'
    id.forEach((ids, index) => {
      if (index == 0) {
        url += encodeURI(`?ids[]=${ids}`)
      } else {
        url += encodeURI(`&ids[]=${ids}`)
      }
      return this.axios.post(url)
    })
  }
  //获取到编辑电影下的类型/cms/v2/mediaTypes
  // getclassType (id) {
  //   const url = env.cms + '/cms/cmsMovieController/getById?id=' + id
  //   return this.axios.get(url)
  // }
  //版权区域
  getcoptyrightLocation () {
    const url = env.cms + '/cms/area/selectAllHasMovie'
    return this.axios.get(url)
  }
  //保存类型的
  updatatype (body) {
    const url = env.cms + '/cms/cmsMovieController/update'
    return this.axios.post(url, body)
  }
  //更新素材
  updataMediaDesc (body) {
    const url = env.cms + '/cms/mediaDesc/batchSave?mediaId=' + body.mediaId
    return this.axios.post(url, body)
  }


  //更新媒咨已下发列表的编辑项新接口
  updateMedias (body) {
    const url = env.cms + '/cms/v2/medias'
    return this.axios.post(url, body)
  }
  //获取编辑的数据
  getEditData (mediaId) {
    const url = env.cms + '/cms/v2/medias/detail?mediaId=' + mediaId
    return this.axios.get(url)
  }
}
