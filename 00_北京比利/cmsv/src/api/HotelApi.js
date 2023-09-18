import Api from "./Api"
import env from "@/env"
import qs from 'qs'
export default new class extends Api {
    constructor() {
        super()
    }
    //酒店数据
    list (Hoteldata) {
        // ?hotelName=${Hoteldata.hotelName}&cityName=${Hoteldata.cityName}
        // const url = `${env.cms}/cms/cmsHotelController/getHotelList?hotelId=${env.hotelId}`
        const url = `${env.cms}/cms/mainController/queryCmsHotels?hotelId=${env.hotelId}`
        return this.axios.post(url,qs.stringify(Hoteldata))
    }
    //获取机型
    one (hotelId) {
        const url = `${env.cms}/cms/cmsHotelController/getHotelById?hotelId=${hotelId}`
        return this.axios.get(url)
    }
    //获取地区
    getArea () {
        const url = `${env.cms}/cms/mainController/queryChCityNames?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    // 获取grp
    getGrp () {
        const url = `${env.cms}/cms/mainController/queryEnGropNames?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    //查找grp
    findGrp (grpId) {
        const url = `${env.cms}/cms/mainController/queryEnGropName?hotelId=${env.hotelId}`
        return this.axios.post(url, qs.stringify(grpId))
    }
    // 获取模板
    getTemplate () {
        const url = `${env.cms}/cms/mainController/queryTemplateIdNames?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    //获取酒店名称
    getHotelName () {
        const url = `${env.cms}/cms/mainController/queryHotelNames?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    //获取全部的设备数据
    getAllDevice () {
        const url = `${env.cms}/cms/deviceTypeController/queryDeviceTypes?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    // 获取语言的数据
    getLanguage () {
        const url = `${env.cms}/cms/language/getLanguageList?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    //获取用户当前选的酒店信息
    getFindHotel (editId) {
        const url = `${env.cms}/cms/mainController/findHotelById?hotelId=${env.hotelId}&editId=${editId}`
        return this.axios.get(url)
    }
    //返回值是数字
    getfindTmeplHotel (editId) {
        const url = `${env.cms}/cms/mainController/findTemplByHotelId?hotelId=${env.hotelId}&editId=${editId}`
        return this.axios.get(url)
    }
    //获取grop名字
    getGropName (grpId) {
        const url = `${env.cms}/cms/mainController/queryChGropName?hotelId=${env.hotelId}`
        return this.axios.post(url, qs.stringify(grpId))
    }
    //获取集团
    getGroup () {
        const url = `${env.cms}/cms/mainController/queryChGropNames?hotelId=${env.hotelId}`
        return this.axios.post(url)
    }
    //新增
    saveAddHotel (body) {
        const url = `${env.cms}/cms/mainController/saveAddorEditHotel`
        return this.axios.post(url, qs.stringify(body))
    }
    //编辑
    saveEditHotel (body) {
        const url = `${env.cms}/cms/mainController/saveAddorEditHotel?hotelId=${env.hotelId}`
        return this.axios.post(url, qs.stringify(body))
    }
    // 查询
    checkBackgroundImg (hotelId) {
        const url = `${env.cms}/cms/mainController/querySketchByHotelId?hotelId=${hotelId}`
        return this.axios.get(url)
    }
}