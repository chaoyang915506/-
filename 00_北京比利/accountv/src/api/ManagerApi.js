import env from "@/env";
import Api from "./Api";

export default new class extends Api {
    constructor() {
        super()
    }

    list() {
        const url = env.account + '/account/manager/getAll'
        return this.axios.get(url)
    }

    create(body) {
        const url = env.account + '/account/manager/add'
        return this.axios.post(url, body, {
            params: {
                manager: body
            }
        })
    }

    update(body) {
        const url = env.account + '/account/manager/update'
        return this.axios.put(url, body, {
            params: {
                manager: body
            }
        })
    }

    updatePwd(body) {
        const url = env.account + '/account/manager/v2/updatePassword'
        return this.axios.post(url, body, {
            params: {
                manager: body
            }
        })
    }

    updatePwdByOld(body) {
        const url = env.account + '/account/manager/v2/updatePasswordByOld'
        return this.axios.post(url, body, {
            params: {
                manager: body
            }
        })
    }

    updatePhone(body) {
        const url = env.account + '/account/manager/bind/phoneNumber';
        return this.axios.post(url, body, {
            params: {
                manager: body
            }
        })
    }

    delete(idArr = []) {
        let url = env.account + '/account/manager?'
        idArr.forEach(id => url += '&id=' + id)
        return this.axios.delete(url)
    }
}