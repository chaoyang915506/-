import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/cmsHotelRoomController/roomlist?hotelId=' + env.hotelId
        return this.axios.get(url)
    }
}