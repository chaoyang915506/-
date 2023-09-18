import Api from "@/api/Api";
import env from "@/env";

export class IrdContact {
    constructor() {
        this.id = 0;
        this.name = '';
        this.phone = '';
        this.onDuty = 0;
        this._vkey = Date.now()
    }
}

export default new class OfiApi extends Api {
    constructor() {
        super()
        this.prefix = `${env.cms}/cms/oceanflowerisland`
    }

    contacts() {
        const url = `${this.prefix}/ird/contacts?hotelId=${env.hotelId}`
        return this.axios.get(url)
    }

    createContact(body) {
        const url = `${this.prefix}/ird/contact?hotelId=${env.hotelId}`
        return this.axios.post(url, body)
    }

    updateContact(body) {
        const url = `${this.prefix}/ird/contact?hotelId=${env.hotelId}`
        return this.axios.put(url, body)
    }

    deleteContact(idArr) {
        let url = `${this.prefix}/ird/contact?hotelId=${env.hotelId}`
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }

    contactOnDuty(idArr) {
        let url = `${this.prefix}/ird/contact/onDuty?hotelId=${env.hotelId}`
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.put(url)
    }

    contactOffDuty(idArr) {
        let url = `${this.prefix}/ird/contact/offDuty?hotelId=${env.hotelId}`
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.put(url)
    }

    orders(start, end) {
        const url = `${this.prefix}/orders?hotelId=${env.hotelId}&start=${start}&end=${end}`
        return this.axios.get(url)
    }

    refund(id, why) {
        const url = `${this.prefix}/order/payment?hotelId=${env.hotelId}&id=${id}&why=${why}`
        return this.axios.delete(url)
    }
}