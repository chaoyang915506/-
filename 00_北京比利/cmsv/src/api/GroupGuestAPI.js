import Api from './Api'
import env from "@/env"

export default new class extends Api {
    constructor() {
        super()
    }

    getGroupGuestList() {
        const url = env.cms + '/cms/groupGuestController/queryGroupGuest?hotelId=' + env.hotelId;
        return this.axios.get(url);
    }

    getGroupRoomList() {
        const url = env.cms + '/cms/groupRoomController/getGroupRoomList?hotelId=' + env.hotelId;
        return this.axios.get(url);
    }

    getHotelRoomList() {
        const url = env.cms + '/cms/cmsHotelRoomController/gethotelroomlist?hotelId=' + env.hotelId;
        return this.axios.get(url);
    }

    addOrEditGroupGuest(param) {
        param.hotelId = env.hotelId;
        const url = env.cms + '/cms/groupGuestController/addOrEdit'
        return this.axios.post(url, param);
    }

    deleteGroupGuest(ids) {
        const url = env.cms + '/cms/groupGuestController/delete?hotelId=' + env.hotelId
        return this.axios.post(url, ids);
    }
}