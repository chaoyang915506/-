import env from "@/env";
import Api from "./Api";

export class Laundry {
    constructor(langId = 0) {
        this.id = 0
        this.metaId = 0
        this.langId = langId
        this.name = ''
        this.desc = ''
    }
}

export class LaundryBody {
    constructor() {
        this.id = 0
        this.classId = 0
        this.hotelId = env.hotelId
        this.price = 0
        this.laundries = [new Laundry(0), new Laundry(1)]
        this.sort = 0
    }
}

const LaundryApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/laundry/laundries?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/laundry'
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/laundry'
        return this.axios.put(url, body)
    }

    delete(idList) {
        if (!idList||idList.length === 0) {
            return Promise.reject();
        }

        let url = env.cms + '/cms/laundry?hotelId=' + env.hotelId
        idList.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }

    updateSort(idArr) {
        const url = env.cms + '/cms/laundry/sort?hotelId=' + env.hotelId
        return this.axios.put(url, idArr)
    }
}

export class LaundryClass {
    constructor(langId = 0) {
        this.id = 0
        this.metaId = 0
        this.langId = langId
        this.name = ''
        this.desc = ''
    }
}

export class LaundryClassBody {
    constructor() {
        this.id = 0
        this.hotelId = env.hotelId
        this.classes = [new LaundryClass(0), new LaundryClass(1)]
    }
}

const LaundryClassApi = new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/laundry/class/classes?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/laundry/class'
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/laundry/class'
        return this.axios.put(url, body)
    }

    delete(idList) {
        let url = env.cms + '/cms/laundry/class?hotelId=' + env.hotelId
        idList.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }
}

const LaundryChargeApi = new class extends Api {
    constructor() {
        super()
    }

    hotelCharge() {
        const url = env.cms + '/cms/laundry/charge?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    update(body) {
        const url = env.cms + '/cms/laundry/charge'
        return this.axios.put(url, body)
    }
}

export {
    LaundryApi, LaundryClassApi, LaundryChargeApi
}