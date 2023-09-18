import env from '@/env'
import Api from './Api'
import qs from 'qs'
export default new class extends Api {
    constructor() {
        super()
    }

    webcasts () {
        const url = env.taikang + '/taikang/backend/webcasts'
        return this.axios.get(url)
    }

    limits () {
        const url = env.taikang + '/taikang/backend/webcasts/limits'
        return this.axios.get(url)
    }

    /**
     * 更新推送园区
     * @param {Number} webcastId 
     * @param {Array} limits 
     */
    updateWebcastLimits (webcastId, limits) {
        const url = `${env.taikang}/taikang/backend/webcasts/${webcastId}/limits?webcastId=` + webcastId
        return this.axios.post(url, limits)
    }
    pushcanelData (action, webcastId, hotelId) {
        const url = `${env.taikang}/taikang/api/webcast/push/batch`
        return this.axios.post(url, action, webcastId, hotelId)
    }
    //推送多对多
    pushData (body) {
        const url = `${env.taikang}/taikang/backend/webcast/limit`
        return this.axios.put(url, body)
    }
    // 取消多对多
    canelpush (body) {
        let url = `${env.taikang}/taikang/backend/webcast/limit`
        body.forEach(id => url += '&id=' + id)
        const index = url.indexOf('&')
        const arr = url.split('')
        arr.splice(index, 1, '?')
        url = arr.join('')
        return this.axios.delete(url)
    }
    //查询所有直播分组
    getcategory () {
        const url = `${env.taikang}/taikang/backend/category`
        return this.axios.get(url)
    }
    getGraden () {
        const url = `${env.taikang}/cmsservice/hotelinfo/allinfo`
        return this.axios.get(url)
    }
    //新增编辑直播分组
    addgoup (body) {
        const url = `${env.taikang}/taikang/backend/category`
        return this.axios.post(url, body)
    }
    groupsort (body) {
        const url = `${env.taikang}/taikang/backend/category/sort`
        return this.axios.put(url, body)
    }
    //删除直播
    dellive (ids) {
        const url = `${env.taikang}/taikang/backend/webcast?${qs.stringify({ id: ids }, { indices: false })}`
        return this.axios.delete(url)
    }
    // 新增编辑直播
    addlive (body) {
        const url = `${env.taikang}/taikang/backend/webcast`
        return this.axios.post(url, body)
    }
    //删除分组
    delgroup (ids) {
        const url = `${env.taikang}/taikang/backend/category?${qs.stringify({ id: ids }, { indices: false })}`
        return this.axios.delete(url)
    }
    //回放分组排序
    groupsortdetil (body) {
        const url = `${env.taikang}/taikang/backend/webcast/sort`
        return this.axios.put(url, body)
    }

}