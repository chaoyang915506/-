import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/castDevice/getAllCastDevice?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/castDevice/add?hotelId=' + env.hotelId
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/castDevice/update?hotelId=' + env.hotelId
        return this.axios.put(url, body)
    }

    delete(idArr = []) {
        const url = env.cms + '/cms/castDevice/batchDelCastDevice?hotelId=' + env.hotelId
        return this.axios.post(url, {
            idList: idArr
        })
    }

    importXlsx(payload) {
        const url = env.cms + '/cms/castDevice/sync?hotelId=' + env.hotelId
        return this.axios.post(url, {
            list: payload
        })
    }
}

export const CastProxyServerApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/castProxyServer/castProxyServers?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/castProxyServer?hotelId=' + env.hotelId
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/castProxyServer?hotelId=' + env.hotelId
        return this.axios.put(url, body)
    }

    delete(idArr = []) {
        let url = env.cms + '/cms/castProxyServer?hotelId=' + env.hotelId
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }

    updateProxy(proxyServerId, roomIds = []) {
        const url = env.cms + '/cms/castProxyServer/' + proxyServerId + '/proxy?hotelId=' + env.hotelId
        return this.axios.post(url, roomIds)
    }
}

export const CastSwitchRelayApi = new class extends Api {
    constructor() {
        super()

        this.prefix = env.cms + '/cms/castSwitchRelay'
    }

    list() {
        const url = this.prefix + '?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(payload) {
        const url = this.prefix + '?hotelId=' + env.hotelId
        return this.axios.post(url, payload)
    }

    update(payload) {
        const url = this.prefix + '?hotelId=' + env.hotelId
        return this.axios.put(url, payload)
    }

    delete(idArr = []) {
        let url = this.prefix + '?hotelId=' + env.hotelId
        idArr.forEach(id => url += '&csrId=' + id)
        return this.axios.delete(url)
    }
}
