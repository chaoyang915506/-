import swal from '@/plugins/sweetalert'

export default new class {
    getParameter(s) {
        var sPageURL = decodeURIComponent(self.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === s) {
                return sParameterName[1];
            }
        }
    }

    /**
     * 弹出提示消息，需要使用sweetalert库
     * @param msg
     * @param cb
     */
    info(msg, cb) {
        swal.info(msg).then(ok => {
            if (ok) {
                cb instanceof Function && cb()
            }
        })
    }

    /**
     * 弹出警告消息，需要使用sweatalert库
     * @param msg
     */
    warn(msg) {
        swal.warn(msg).then(ok => { });
    }

    /**
     * 弹出确认消息，需要使用sweatalert库
     * @param title
     * @param msg
     * @param confirmFun
     * @param cancelFun
     */
    confirm(title, msg, confirmFun, cancelFun) {
        swal.confirm(title, msg).then(ok => {
            if (ok) {
                confirmFun instanceof Function && confirmFun()
            } else {
                cancelFun instanceof Function && cancelFun()
            }
        })
    }

    /**
     * 弹出错误消息，需要使用sweatalert库
     * @param msg
     */
    error(msg) {
        swal.error(msg).then(() => { });
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    return fmt;
};

Number.prototype.withComma = function () {
    return this.toString().withComma();
};

String.prototype.withComma = function () {
    var num = this.split('.'),
        integerPart = num[0],
        decimalPart = num[1],
        result = '';
    while (integerPart.length > 3) {
        result = ',' + integerPart.slice(-3) + result;
        integerPart = integerPart.slice(0, integerPart.length - 3);
    }
    if (integerPart) {
        result = integerPart + result;
    }
    if (decimalPart) {
        result += '.' + decimalPart;
    }
    return result;
};