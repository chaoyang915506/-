import env from "@/env"

export class SwitchRelay {
    constructor() {
        this.csrId = 0
        this.hotelId = env.hotelId
        this.csrType = 0
        this.csrRelayCount = 0
        this.csrTty = ''
        this.devices = [] // Array<SwitchRelayDevice>
    }
}

export class SwitchRelayDevice {
    constructor() {
        this.csrdId = 0
        this.csrId = 0
        this.castDeviceId = 0
        this.csrdRelayNum = 0
    }
}