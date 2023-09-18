import Api from "./Api";
import env from "@/env";

export default new class extends Api {
    constructor() {
        super()
        this.prefix = env.cms + '/cms/cmsItemHotelController'
    }

    list() {
        const url = this.prefix + '?hotelId=' + env.hotelId
        return this.axios.get(url);
    }
}