import Api from "./Api";
import env from "@/env";

export default new class extends Api {
    constructor() {
        super()
        this.prefix = env.cms + '/cms/itemHotelParam'
    }

    list() {
        const url = this.prefix + '?hotelId=' + env.hotelId
        return this.axios.get(url);
    }

    one(id) {
        const url = this.prefix + '/' + id;
        return this.axios.get(url);
    }

    create(body) {
        return this.axios.post(this.prefix, body);
    }

    update(body) {
        return this.axios.put(this.prefix, body);
    }

    delete(idArray) {
        let url = this.prefix + '?hotelId=' + env.hotelId;
        idArray.forEach(id => url += '&id=' + id);
        return this.axios.delete(url);
    }
}
