import VeeValidate, { extend, localize, ValidationObserver, ValidationProvider } from "vee-validate"
import zh_CN from 'vee-validate/dist/locale/zh_CN.json'
import * as rules from "vee-validate/dist/rules"
import Vue from 'vue'

localize('zh_CN', zh_CN)

for (let k in rules) {
    extend(k, rules[k])
}


extend('required', {
    ...rules,
    message: (field) => field + '是必填的内容'
})
extend('email', {
    ...rules,
    message: (field) => '请输入有效' + field
})
//可传两个参数第一个参数是最少的数量 第二个参数为最大
extend('equals_norequired', {
    validate: (value, len) => {
        if (value.length < len[0] || value.length > len[1]) {
            return false
        }
        return true
    },
    message: (field, element) => {
        return `${field}长度在${element['0']}~${element['1']}之间！`
    }
})

extend('equals_to', {
    params: ['target'],
    validate: (value, { target }) => {
        return value === target
    },
    message: '两次输入密码不相同'
})

extend('datediff_to', {
    params: ['target'],
    validate: (value, { target }) => {
        return value !== target && Date.parse(value) > Date.parse(target)
    },
    message: '直播开始时间不能和直播结束时间相同或直播结束时间不能小于直播开始时间'
})
Vue.directive('validate', {
    componentUpdated: (el, binding) => {
        const clz = binding.value.errors[0]
            ? 'is-invalid'
            : binding.value.validated
                ? 'is-valid'
                : ''
        $(el).removeClass('is-invalid').removeClass('is-valid').addClass(clz)
    },
})
Vue.directive('requiredSty', {
    componentUpdated: (el, binding) => {
        const clz = binding.value.errors[0]
            ? 'is-block'
            : binding.value.validated
                ? 'is-none'
                : ''
        $(el).removeClass('is-block').removeClass('is-none').addClass(clz)
    },
})
Vue.component('vo', ValidationObserver)
Vue.component('vp', ValidationProvider)
// Vue.use(VeeValidate)
export const Pattern = {
    IP: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    MAC: /(([a-f]|[A-F]|\d){2}:){5}([a-f]|[A-F]|\d){2}/,
    URL: /^(http(s?)|):\/\/(.+)$/
}