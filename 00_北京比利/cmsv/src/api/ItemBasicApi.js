import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/itemBasics'
        return this.axios.get(url);
    }

    create(item) {
        const url = env.cms + '/cms/itemBasics'
        return this.axios.post(url, item)
    }

    update(body) {
        const url = env.cms + '/cms/itemBasics'
        return this.axios.put(url, body)
    }
}