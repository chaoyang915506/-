import env from '@/env';
import md5 from 'md5';
import Api from './Api';

export default new class extends Api {
    constructor() {
        super()
    }

    login(username, password) {
        const url = env.account + '/account/login'
        return this.axios.post(url, {
            username, password: md5(password)
        })
    }

    verify(username, phoneNumber, verifyCode) {
        const url = env.account + '/account/login/verify'
        return this.axios.post(url, {username, phoneNumber, verifyCode})
    }

    sendSms(username, password) {
        const url = env.account + '/account/login'
        return this.axios.post(url, {
            username, password: md5(password)
        });
    }

    logout() {
        const url = env.account + '/account/logout';
        return this.axios.post(url);
    }

    isExpired() {
        const url = env.account + '/account/token/isExpired'
        return this.axios.get(url)
    }

    hotels() {
        const url = env.account + '/account/cms/hotels';
        return this.axios.get(url);
    }
}