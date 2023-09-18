import Api from "./Api";
import env from "@/env";
import qs from 'qs'

export default new class extends Api {
    constructor() {
        super()
    }

    list(itemId) {
        const url = env.cms + '/cms/hotelContent/getContentByItem?hotelId=' + env.hotelId + '&itemId=' + itemId
        return this.axios.get(url)
    }

    create(itemId, body) {
        const url = env.cms + '/cms/hotelContent?hotelId=' + env.hotelId + '&itemId=' + itemId
        return this.axios.post(url, body);
    }

    update(itemId, body) {
        const url = env.cms + '/cms/hotelContent?hotelId=' + env.hotelId + '&itemId=' + itemId
        return this.axios.put(url, body)
    }

    /**
     * 批量删除
     * @param {Array} miIdList 
     */
    delete(miIdList) {
        let url = env.cms + '/cms/hotelContent?hotelId=' + env.hotelId
        miIdList.forEach(id => url += '&miId=' + id)
        return this.axios.delete(url);
    }

    sort(miIdList) {
        const url = env.cms + '/cms/hotelContent/sortContent?hotelId=' + env.hotelId
        return this.axios.post(url, qs.stringify({ miIds: miIdList }, { arrayFormat: "brackets" }))
    }
}