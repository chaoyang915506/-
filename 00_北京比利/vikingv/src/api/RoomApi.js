import Api from "./Api";
import env from "../env";
export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cmsservice + '/cmsservice/hotelinfo/roomsinfo?hotelId=' + env.hotelId
        return this.axios.get(url);
    }

    restart() { }
}