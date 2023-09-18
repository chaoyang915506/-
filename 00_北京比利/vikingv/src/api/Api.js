import Axios from "axios";
import common from "../common";

class Api {
    constructor() {
        this.axios = Axios.create({});

        // 添加请求拦截器
        this.axios.interceptors.request.use(config => {
            // 自带session的部分，不加token
            if (config.withCredentials) {
                return config;
            }

            if (config.params === undefined) {
                config.params = {};
            }

            // token在url参数中或在sessionStorage中
            config.params.token = common.getParameter('token') || sessionStorage.getItem('token')
            return config;
        });

        // 添加响应拦截器
        this.axios.interceptors.response.use(response => {
            // TODO handle response.status 4XX 5XX, redirect to err page

            if (response.data.code === '0xffff') {
                console.error('code: ' + response.data.code + ', msg: ' + response.data.msg);
                return Promise.reject('Critical Error!');
            } else if (response.data.code !== '0x0000') {
                console.error('code: ' + response.data.code + ', msg: ' + response.data.msg);
                return Promise.reject(response.data.msg);
            }

            return Promise.resolve(response.data.data);
        });
    }

    static async all(requests, responses) {
        return Axios.all(requests).then(Axios.spread(responses))
    }
}

export default Api;