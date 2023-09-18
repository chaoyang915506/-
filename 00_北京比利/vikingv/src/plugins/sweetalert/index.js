import './custom.scss'
import swal from 'sweetalert'

const ok = {
    visible: true, text: '确定'
}
const cancel = {
    visible: true, text: '取消'
}

swal.install = (Vue, options) => {
    Vue.prototype.$info = msg => {
        return swal({
            text: msg, icon: 'success', button: ok,
        })
    }

    Vue.prototype.$confirm = (title, msg) => {
        return swal({
            title: title, text: msg, icon: 'warning', buttons: {cancel, ok}
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
}

export default swal