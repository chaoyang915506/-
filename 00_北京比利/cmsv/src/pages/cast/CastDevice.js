export class CastProxyServer {
    constructor() {
        this.id = 0
        this.hotelId = 0
        this.name = ''
        this.ipInIptvLan = ''
        this.ipInGuestLan = ''
        this.rooms = []
    }
}

export class CastDevice {
    constructor() {
        this.id = 0
        this.hotelId = 0
        this.castProxyServerId = 0
        this.type = 0
        this.ip = ''
        this.mac = ''
        this.roomId = 0
        this.roomNumber = '' // addition field
        this.castAddr = ''
        this.location = 0
        this.devLocation = 0
    }
}