import env from '@/env'
import Api from './Api'

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
        const url = `${env.taikang}/taikang/api/webcast/limit`
        return this.axios.put(url, body)
    }
    // 取消多对多
    canelpush (body) {
        let url = `${env.taikang}/taikang/api/webcast/limit`
        body.forEach(id => url += '&id=' + id)
        const index = url.indexOf('&')
        const arr = url.split('')
        arr.splice(index, 1, '?')
        url = arr.join('')
        return this.axios.delete(url)
    }
}