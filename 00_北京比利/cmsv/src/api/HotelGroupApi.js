import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/hotelGroups'
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/hotelGroups'
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/hotelGroups'
        return this.axios.put(url, body)
    }

    delete(grpId) {
        let url = env.cms + '/cms/hotelGroups?grpId=' + grpId
        return this.axios.delete(url)
    }
}
