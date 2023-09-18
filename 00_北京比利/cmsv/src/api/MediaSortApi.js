import env from "@/env"
import Api from "./Api"

export default new class extends Api {
    constructor() {
        super()
    }
    //获取全部栏目 
    getColumnApi () {
        const url = env.cms + '/cms/media/getMediaBasicItemList'
        return this.axios.get(url)
    }
    //获取全部当前栏目
    getColumnCountApi (type) {
        const url = env.cms + '/cms/media/getMediaList?metaType=' + type;        return this.axios.get(url)
    }
    savesortApi (body) {
        const url = env.cms + '/cms/media/saveMediaListSort'
        return this.axios.post(url, body)
    }
}
