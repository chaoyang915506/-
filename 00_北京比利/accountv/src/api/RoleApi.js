import env from "@/env";
import Api from "./Api";

export default new class RoleApi extends Api {
    constructor() {
        super();
    }

    list() {
        const url = env.account + '/account/role/getAll';
        return this.axios.get(url);
    }

    create(body) {
        const url = env.account + '/account/role/addRole'
        return this.axios.post(url, body, {
            params: {
                role: body
            }
        })
    }

    update(body) {
        const url = env.account + '/account/role/updateById'
        return this.axios.put(url, body, {
            params: {
                role: body
            }
        })
    }

    delete(idArr = []) {
        let url = env.account + '/account/role?';
        idArr.forEach(id => url += '&id=' + id);
        return this.axios.delete(url);
    }

    auth(id) {
        const url = env.account + '/account/role/roleAuthInfoById?roleId=' + id
        return this.axios.get(url);
    }

    updateAuth(body) {
        const url = env.account + '/account/role/updateRoleAuth'
        return this.axios.post(url, body);
    }
}