import common from "@/common"

export default new (class {
  constructor() {
    this.cms = process.env.VUE_APP_CMS
    this.lms = process.env.VUE_APP_LMS
    this.ims = process.env.VUE_APP_IMS
    this.sync = process.env.VUE_APP_SYNC
    this.cmsservice = process.env.VUE_APP_CMSSERVICE
  }

  get hotelId () {
    return common.getParameter("hotelId") || sessionStorage.getItem("hotelId")
  }

  get token () {
    return common.getParameter("token") || sessionStorage.getItem("token")
  }

  get locale () {
    return common.getParameter("locale") || sessionStorage.getItem("locale")
  }

  get vendor () {
    return process.env.VUE_APP_VENDOR == "hotel" ? this.locale == 0 ? "酒店" : "hotel" : this.locale == 0 ? "园区" : "garden"
  }
})()
