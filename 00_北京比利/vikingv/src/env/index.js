import common from '@/common'

export default new class {
    constructor() {
        this.viking = process.env.VUE_APP_VIKING;
        this.cmsservice = process.env.VUE_APP_CMSSERVICE;
    }

    /**
     * 获取token
     */
    get token() {
        //从common或者session获取token
        return common.getParameter('token') || sessionStorage.getItem('token')
    }

    get hotelId() {
        return common.getParameter('hotelId') || sessionStorage.getItem('hotelId')
    }

};