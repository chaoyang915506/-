import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    hotels() {
        const url = env.account + '/account/cms/hotels'
        return this.axios.get(url)
    }

    hotelGroups() {
        const url = env.account + '/account/cms/hotelGroups'
        return this.axios.get(url)
    }
}