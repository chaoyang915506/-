import env from '@/env';
import md5 from 'md5';
import Api from './Api';

export default new class extends Api {
    constructor() {
        super();
    }

    accessByPage(currentPage, pageSize) {
        const url = env.account + "/account/access/page?currentPage=" + currentPage + "&pageSize=" + pageSize;
        return this.axios.get(url);
    }

    // menuList 当前访问页面的数据
    accessMenu(menuList) {
        const url = env.account + "/account/access/addAccessRecord"
        return this.axios.post(url,menuList)
    }
}