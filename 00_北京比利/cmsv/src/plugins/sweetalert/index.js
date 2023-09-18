// import './custom.css'
import swal from 'sweetalert';

export default {
    info: msg => {
        return swal({
            text: msg,
            icon: 'success',
            buttons: '确定'
        })
    },
    confirm: (title, msg) => {
        return swal({
            title: title,
            text: msg,
            icon: "warning",
            buttons: ['取消', '确定'],
        });
    },
    warn: msg => {
        return swal({
            title: msg,
            icon: 'warning',
            buttons: '确定'
        })
    },
    error: msg => {
        return swal({
            title: msg,
            icon: 'error',
            buttons: '确定'
        })
    }
}