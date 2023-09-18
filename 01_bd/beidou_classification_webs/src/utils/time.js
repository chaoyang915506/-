function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
    );
    var week = weeks[day];
    return week;
}
export function getTimeStr(t) {
    let d = Date.parse(new Date())
    if (d) {
        switch (d.toString().length) {
            case 10:
                d = d * 1000;
                break;
            case 13:
                d = d * 1;
                break;
            default:
                break;
        }
        var now = new Date(parseInt(d));
        var year = now.getFullYear();
        var month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
        var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
        var hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        var minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        var seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
        if (t) {
            if (t == 1) {
                return year + '/' + month + '/' + date + ' ';
            } else if (t == 2) {
                return year + '年' + month + '月' + date + '日' + ' ' + hours + ':' + minutes + ':' + seconds;
            } else if (t == 3) {
                return year + ' . ' + month + ' . ' + date;
            } else if (t == 4) {
                return hours + '：' + minutes;
            } else if (t == 5) {
                return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
            } else if (t == 6) {
                return year + '-' + month + '-' + date;
            } else if (t == 7) {
                return year + '年' + month + '月' + date + '日' + ' ' +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '+ getWeekDate() +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0 '+ hours + ':' + minutes + ':' + seconds;
            }
        } else {
            return year + ' 年 ' + month + ' 月 ' + date + ' 日 ';
        }
    }
}


