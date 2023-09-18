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

    get taikang() {
        return process.env.VUE_APP_TAIKANG
    }

    get cmsservice() {
        return process.env.VUE_APP_CMSSERVICE
    }
}