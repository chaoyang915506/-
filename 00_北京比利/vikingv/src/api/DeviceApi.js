import Api from "./Api"
import env from "@/env"

export default new class extends Api {
    constructor() {
        super()
    }

    list () {
        const url = env.viking + '/viking/devices?hotelId=' + env.hotelId
        return this.axios.get(url)
    }

    restart (snArr) {
        const url = env.viking + '/viking/devices/ctrl?hotelId=' + env.hotelId
        const ctrls = snArr.map(sn => {
            return {
                sn,
                cmd: 'reboot'
            }
        })

        return this.axios.post(url, {
            ctrls
        })
    }

    mute (snArr) {
        const url = env.viking + '/viking/devices/ctrl?hotelId=' + env.hotelId
        const ctrls = snArr.map(sn => {
            return {
                sn,
                cmd: 'mute'
            }
        })

        return this.axios.post(url, {
            ctrls
        })
    }

    unmute (snArr) {
        const url = env.viking + '/viking/devices/ctrl?hotelId=' + env.hotelId
        const ctrls = snArr.map(sn => {
            return {
                sn,
                cmd: 'unmute'
            }
        })

        return this.axios.post(url, {
            ctrls
        })
    }
    updataData (snArr) {
        const url = env.viking + '/viking/devices/ctrl?hotelId=' + env.hotelId
        const ctrls = snArr.map(sn => {
            return {
                sn,
                cmd: 'firmware'
            }
        })
        return this.axios.post(url, { ctrls })
    }
}