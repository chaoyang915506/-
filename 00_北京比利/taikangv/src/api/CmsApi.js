import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    hotels() {
        const url = env.cmsservice + '/cmsservice/hotelinfo/allinfo'
        return this.axios.get(url)
    }
}