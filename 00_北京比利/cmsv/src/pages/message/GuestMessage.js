// 客信关联关系
export const RelType = {
    // 全局
    DEFAULT: 0,
    // 客房
    ROOM: 1,
    // 分组/团客
    GROUP: 2
}

export const MsgType = {
    // 公信
    PUBLIC: 0,
    // 私信
    PRIVATE: 1,
    // PMS消息
    PMS: 2
}

export class GuestMessage {
    constructor() {
        this.id = 0
        this.msgType = MsgType.PRIVATE // 默认私信
        this.contentType = 0
        this.relType = RelType.ROOM // 默认房间
        this.groupGuestId = 0
        this.hotelId = 0
        this.langId = 0
        this.title = ''
        this.text = ''
        this.pic = ''
        this.video = ''
        this.isEnable = 1 // 默认启用
        this.creatTime = 0
        this.roomIdList = []
    }
}
export class AddGuestMessage {
    constructor() {
        this.groupGuestId = '-1'
        // this.msgList = [
        // ]
        // this.id = 0
        this.relType = 1
        this.roomIdList = []
    }
}
export class msgList {
    constructor() {
        this.contentType = 0
        this.hotelId = ''
        this.isEnable = 1
        this.langId = ''
        this.msgType = '1'
        this.pic = ''
        this.relType = '1'
        this.text = ''//内容
        this.title = ''
        this.video = ''
    }
}
