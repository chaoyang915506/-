import common from "@/common";

export default new class {
    constructor() {
    }

    get hotelId() {
        return common.getParameter('hotelId') || sessionStorage.getItem('hotelId')
    }

    get token() {
        return common.getParameter('token') || sessionStorage.getItem('token')
    }

    get locale() {
        return common.getParameter('locale') || sessionStorage.getItem('locale')
    }

    get account() {
        return process.env.VUE_APP_ACCOUNT
    }
}