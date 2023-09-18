import Api from "@/api/Api"
import env from "@/env"
import qs from 'qs'

export const LmsApi = new class extends Api {
    constructor() {
        super()

        this.prefix = env.lms + '/lms'
    }

    info () {
        const url = this.prefix + '/pms/info?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    health () {
        const url = this.prefix + '/pms/health?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    sync () {
        const url = this.prefix + '/pms/sync?hotelId=' + env.hotelId
        return this.axios.post(url)
    }

    checkRoom (roomNumber) {
        const url = this.prefix + '/pms/checkRoom?hotelId=' + env.hotelId + '&roomNumber=' + roomNumber
        return this.axios.get(url)
    }

    roomsInfo (roomNumber) {
        const url = this.prefix + '/cms/allRooms?hotelId=' + env.hotelId + '&roomNumber=' + roomNumber
        return this.axios.get(url)
    }

    check (roomNumber, names) {
        const url = `${this.prefix}/pms/check?hotelId=${env.hotelId}&roomNumber=${roomNumber}&names=${names}`
        return this.axios.get(url)
    }

    clearGuests (roomNumber) {
        const url = `${this.prefix}/pms/guests?hotelId=${env.hotelId}&roomNumber=${roomNumber}`
        return this.axios.delete(url)
    }


    //获取数据ips[]
    getDeviceRoom () {
        const url = this.prefix + '/device/getDeviceListByHotelId?hotelId=' + env.hotelId
        return this.axios.get(url)
    }
    //获取全部设备名称
    getDeviceName () {
        const url = this.prefix + '/device/deviceTypes'
        return this.axios.get(url)
    }
    // 重启3 刷新6 克隆10
    devicestart (deviceSer) {
        let url = this.prefix + '/device/deviceTrigger?hotelId=' + env.hotelId + '&cmd=' + deviceSer.cmd
        deviceSer.ids.forEach(ids => url += encodeURI(`&snList[]=${ids}`))
        return this.axios.post(url)
    }
    //ping
    deviceping (deviceSer = []) {
        let url = this.prefix + '/device/ping?hotelId=' + env.hotelId
        deviceSer.forEach(ips => url += encodeURI(`&ips[]=${ips}`))
        return this.axios.post(url)
    }
}
export const CmdApi = new class extends Api {
    constructor() {
        super()
    }
    list () {
        const url = env.lms + '/lms/cmd/all'
        return this.axios.get(url)
    }
    create (data) {
        const url = env.lms + '/lms/cmd'
        return this.axios.post(url, qs.stringify(data))
    }

    delete (data = []) {
        let url = env.lms + '/lms/cmd/batchDel?'
        data.forEach(id => url += encodeURI(`&ids[]=${id}`))
        return this.axios.post(url)
    }
}
export const TriggerApi = new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.lms + '/lms/trigger/all'
        return this.axios.get(url)
    }

    create (data) {
        const url = env.lms + '/lms/trigger'

        return this.axios.post(url, qs.stringify(data))
    }
    delete (data = []) {
        let url = env.lms + '/lms/trigger/batchDel?'
        data.forEach(id => url += encodeURI(`&ids[]=${id}`))
        return this.axios.post(url)
    }


}

export const TriggerTypeApi = new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.lms + '/lms/triggerType/all'
        return this.axios.get(url)
    }

    create (model) {
        const url = env.lms + '/lms/triggerType'

        return this.axios.post(url, qs.stringify({ triggerType: model }))
    }

    delete (data = []) {
        let url = env.lms + '/lms/triggerType/batchDel?'
        data.forEach(id => url += encodeURI(`&ids[]=${id}`))
        return this.axios.post(url)
    }


}
export const DeviceTriggerTypeApi = new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.lms + '/lms/dtt/all'
        return this.axios.get(url)
    }
    //获取全部命令
    getorder () {
        const url = env.lms + '/lms/cmd/all'
        return this.axios.get(url)
    }

}

export const StrategyApi = new class extends Api {
    constructor() {
        super()
    }

    gettype () {
        const url = env.lms + '/lms/device/getDeviceListByHotelId?hotelId=' + env.hotelId
        return this.axios.get(url)
    }
    list () {
        const url = env.lms + '/lms/strategy/strategies?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create (data) {
        // const url = env.lms + '/lms/strategy/add?hotelId=' + env.hotelId
        const url = env.lms + '/lms/dtt/update?hotelId=' + env.hotelId

        return this.axios.post(url, qs.stringify(data))
    }
    stategyCreate (data) {
        const url = env.lms + '/lms/strategy/add?hotelId=' + env.hotelId

        return this.axios.post(url, qs.stringify(data))
    }

    update (data) {
        const url = env.lms + '/lms/strategy/update?hotelId=' + env.hotelId
        return this.axios.post(url, qs.stringify(data))
    }

    delete (data = []) {
        let url = env.lms + '/lms/strategy/batchDel?hotelId=' + env.hotelId
        data.forEach(id => url += encodeURI(`&ids[]=${id}`))
        return this.axios.post(url)
    }

}
export const DeviceApi = new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.cms + '/cms/cmsDeviceController/devicelist?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

}

export const HotelCloneApi = new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.lms + '/lms/clone/info?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create (data) {
        const url = env.lms + '/lms/trigger'

        return this.axios.post(url, qs.stringify(data))
    }
    delete (data = []) {
        let url = env.lms + '/lms/trigger/batchDel?'
        data.forEach(id => url += encodeURI(`&ids[]=${id}`))
        return this.axios.post(url)
    }


}
