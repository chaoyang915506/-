import Api from './Api'
import env from "@/env"

export default new class extends Api {
    constructor() {
        super()
    }

    initWelcome(data) {
        const url = env.cms + '/cms/welcome/initwelcome?hotelId=' + env.hotelId
            + '&strategyType=' + data.strategyType + '&priority=' + data.priority + '&groupGuestId=' + data.groupGuestId;
        return this.axios.get(url);
    }
    addWelcome (entity) {
        const url = env.cms + '/cms/welcome/addWelcome?hotelId=' + env.hotelId;
        return this.axios.post(url, entity)
    }

    updateMoreLang(entity) {
        const url = env.cms + '/cms/welcome/updateMoreLang?hotelId=' + env.hotelId
        return this.axios.post(url, entity)
    }
      // 查询
      checkBackgroundImg (hotelId) {
        const url = `${env.cms}/cms/mainController/querySketchByHotelId?hotelId=${hotelId}`
        return this.axios.get(url)
    }
}