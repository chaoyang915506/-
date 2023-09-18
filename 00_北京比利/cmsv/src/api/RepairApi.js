import env from "@/env";
import Api from "./Api";

export class Repair {
    constructor() {
        this.repairId = 0
        this.hotelId = env.hotelId
        this.repairType = 1
        this.repairExternalCode = ''
        this.repairSort = 0
        this.repairLangs = [new RepairLang(0), new RepairLang(1)]
    }
}

export class RepairLang {
    constructor(langId = 0) {
        this.repairLangId = 0
        this.repairId = 0
        this.langId = langId
        this.repairLangName = ''
        this.repairLangDesc = ''
    }
}

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.cms + '/cms/repair/repairs?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    create(body) {
        const url = env.cms + '/cms/repair'
        return this.axios.post(url, body)
    }

    update(body) {
        const url = env.cms + '/cms/repair'
        return this.axios.put(url, body)
    }

    delete(idArr) {
        let url = env.cms + '/cms/repair?hotelId=' + env.hotelId
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }

    updateSort(idArr) {
        const url = env.cms + '/cms/repair/sort?hotelId=' + env.hotelId
        return this.axios.put(url, idArr)
    }
}