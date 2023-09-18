// import './custom.css'
import swal from 'sweetalert'
import Env from '@/env'

const ok = {
    text: Env.locale == "0" ? "确定" : "ok", value: true, className: 'btn btn-primary', visible: true,
}
const cancel = {
    text: Env.locale == "0" ? "取消" : "cancel", value: false, className: 'btn btn-secondary', visible: true,
}

swal.install = (Vue, options) => {
    Vue.prototype.$info = msg => {
        return swal({
            text: msg, icon: 'success', button: ok,
        })
    }

    Vue.prototype.$confirm = (title, msg) => {
        return swal({
            title: title, text: msg, icon: 'warning', buttons: {
                cancel, ok
            }
        })
    }

    Vue.prototype.$warn = msg => {
        return swal({
            title: msg, icon: 'warning', button: ok
        })
    }

    Vue.prototype.$error = msg => {
        return swal({
            title: msg, icon: 'error', button: ok
        })
    }

    Vue.prototype.$error = (title, msg) => {
        return swal({
            title: title, text: msg, icon: 'error', button: ok
        })
    }
}

export default swal