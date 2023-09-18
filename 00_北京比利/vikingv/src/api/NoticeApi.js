import Api from "@/api/Api"
import env from "@/env"

export default new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.viking + '/viking/notices'
        return this.axios.get(url)
    }

    delete (idArr = []) {
        let url = env.viking + '/viking/notices?'
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }

    update (sn, roomNumber, confirmed) {
        const url = env.viking + '/viking/notices?hotelId=' + env.hotelId + '&sn=' + sn + '&roomNumber=' + roomNumber + '&confirmed=' + confirmed
        return this.axios.put(url)
    }
    getGuestName () {
        const url = env.viking + '/vikingservice/guest'
        return this.axios.get(url)
    }
}