export class Manager {
    constructor() {
        this.id = 0
        this.mode = 1 // 登录方式，默认手机验证码登录
        this.hotelId = 0
        this.hotelGroupId = 0
        this.roleId = 0
        this.managerAccount = ''
        this.managerName = ''
        this.managerPwd = ''
        this.phoneNumber = ''
        this.managerStatus = 1 // 0 - 禁用；1 - 启用; 2 - 锁定
    }
}


export const LoginMode = Object.freeze({
    UsernamePassword: 0,
    PhonenumberVerification: 1,
    Captcha: 2
})