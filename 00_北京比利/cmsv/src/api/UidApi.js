import env from "@/env";
import Api from "./Api";

const UidApi = new class extends Api {
    constructor() {
        super()
        this.prefix = env.cms + '/cms/uid'
    }

    list() {
        const url = this.prefix + '/uids'
        return this.axios.get(url)
    }

    create(body) {
        return this.axios.post(this.prefix, body)
    }

    update(body) {
        return this.axios.put(this.prefix, body)
    }

    delete(idArr = []) {
        let url = this.prefix + '?'
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }
}

const UidExtraApi = new class extends Api {
    constructor() {
        super();
        this.prefix = env.cms + '/cms/uidExtra';
    }

    list() {
        const url = this.prefix + '/uidExtras?hotelId=' + env.hotelId;
        return this.axios.get(url);
    }

    create(body) {
        return this.axios.post(this.prefix, body);
    }

    update(body) {
        return this.axios.put(this.prefix, body);
    }

    /**
     * 
     * @param {Array} body Array of UidExtra
     */
    updateAll(body = []) {
        const url = this.prefix + '/uidExtras?hotelId=' + env.hotelId;
        return this.axios.post(url, body);
    }

    delete(idArr = []) {
        let url = this.prefix + '?';
        idArr.forEach(id => url += '&id=' + id);
        return this.axios.delete(url);
    }
}

export {
    UidApi, UidExtraApi,
};
