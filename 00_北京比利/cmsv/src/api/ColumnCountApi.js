import env from "@/env"
import Api from "./Api"
import Axios from 'axios'
import qs from 'qs'
export default new class extends Api {
  constructor() {
    super()
  }
  //新增
  addcolumn (body) {
    const url = `${env.cms}/cms/cmsMediainfoDescController/saveAddOrEditHotelItemContent?itemId=${body.itemId}&miName=${body.miName}&miType=${body.miType}&miVideoType=${body.miVideoType}&miMovieType=${body.miMovieType}&miDefault=${body.miDefault}&miArea=${body.miArea}&miCompany=${body.miCompany}&miYear=${body.miYear}&isEnable=${body.isEnable}&miStatus=${body.miStatus}&miId=${body.miId}&miImage=${body.miImage}&miImage1=${body.miImage1}&miImage2=${body.miImage2}&miImage3=${body.miImage3}&miImage4=${body.miImage4}&videoPlayUrl=${body.videoPlayUrl}&sort=${body.sort}&itemId1=${body.itemId1}&miName1=${body.miName1}&miType1=${body.miType1}&miVideoType1=${body.miVideoType1}&miMovieType1=${body.miMovieType1}&miDefault1=${body.miDefault1}&miArea1=${body.miArea1}&miCompany1=${body.miCompany1}&miYear1=${body.miYear1}&isEnable1=${body.isEnable1}&miStatus1=${body.miStatus1}&miIdEn=${body.miIdEn}&miImageEn=${body.miImageEn}&miImage1En=${body.miImage1En}&miImage2En=${body.miImage2En}&miImage3En=${body.miImage3En}&miImage4En=${body.miImage4En}&videoPlayUrlEn=${body.videoPlayUrlEn}&sort1=${body.sort1}&code=${body.code}&hotelId=${env.hotelId}&token=${env.token}`
    return this.axios.post(url)
  }

  //获取主页的数据 栏目所属酒店
  gethomepage () {
    const url = `${env.cms}/cms/cmsItemHotelController/queryHotelIdAndNames?hotelId=${env.hotelId}&token=${env.token}`
    return this.axios.post(url)
  }
  //获取中英文的数据 miId miIdEn
  getcountdata (body) {
    const url = `${env.cms}/cms/cmsMediainfoDescController/batchQueryMediainfoDescBymiId?miId=${body[0]}&miIdEn=${body[1]}&token=${env.token}`
    return this.axios.post(url)
  }
  //获取米id 需要参数 itemId itemIdEn
  getMiId (body) {
    const url = `${env.cms}/cms/cmsMediainfoDescController/batchQueryMediainfoDescs?itemId=${body[0]}&itemIdEn=${body[1]}&token=${env.token}`
    return this.axios.post(url)
  }
  //获取itemId 和itemIDEN
  getItemId (body) {
    const url = `${env.cms}/cms/cmsItemHotelController/getItemsByBasicId?hotelId=${env.hotelId}&itemBasicId=${body.itemBasicId}&token=${env.token}`
    return this.axios.get(url)
  }
  //获取酒店的语言
  getLangHotel () {
    const url = `${env.cms}/cms/hotelLang/getLangListByHotelId?hotelId=${env.hotelId}`
    return this.axios.get(url)
  }
  //查栏目内容
  getcolument (body) {
    let url = `${env.cms}/cms/cmsMediainfoDescController/batchQueryMediainfoDescs/v2?hotelId=${env.hotelId}`
    body.forEach(it => url += `&itemIds=${it}`)
    return this.axios.get(url)
  }
  //编辑栏目内容
  editColument (body) {
    const url = `${env.cms}/cms/cmsMediainfoDescController/saveAddOrEditHotelItemContent/v2?hotelId=${env.hotelId}&itemBasicId=${body.itemBasicId}`
    return this.axios.post(url, body.list)
  }
}