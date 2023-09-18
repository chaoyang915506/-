import env from "@/env"
import Api from "./Api"

export default new class extends Api {
    constructor() {
        super()

        this.selectAllUrl = env.cms + '/cms/message/getMessage'
    }

    /**
     * {
     *  relType: relType,
     *  groupGuestId: groupGuestId,
     *  msgList: [{
     *      msgType: msgType,
     *      contentType: contentType,
     *      relType: relType,
     *      hotelId: hotelId,
     *      langId: 0,
     *      title: title0,
     *      text: text0,
     *      pic: pic,
     *      video: video,
     *      isEnable: isEnable
     *  }],
     *  roomIdList: [1,2]
     * }
     */
    create (body) {
        const url = env.cms + '/cms/message?hotelId=' + env.hotelId
        return this.axios.post(url, body)
    }
    //新增
    // addmessage (body) {
    //     const url = env.cms + '/message/addMessage?hotelId=' + env.hotelId
    //     return this.axios.post(url,body)
    // }

    /**
     * 更新
     * @param {*} body 
     * @returns 
     */
    update (body) {
        const url = env.cms + '/cms/message/updateMessage?hotelId=' + env.hotelId
        return this.axios.post(url, body)
    }

    updateMessageRoom (messageId, roomIdArr = []) {
        const url = env.cms + '/cms/message/updateMessageRoom?hotelId=' + env.hotelId + '&msgId=' + messageId
        return this.axios.post(url, {
            roomIdList: roomIdArr
        })
    }

    delete (idArr = []) {
        let url = env.cms + '/cms/message?hotelId=' + env.hotelId
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }
    //獲取酒店的語言
    getHotelLang () {
        const url = env.cms + '/cms/hotelLang/getLangListByHotelId?hotelId=' + env.hotelId
        return this.axios.get(url)
    }
}