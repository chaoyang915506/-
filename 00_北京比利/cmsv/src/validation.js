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
// extend('max', {
//     ...rules,
//     message: (field, element) => {
//         return `${field}长度在1-${element.length}个字符之间`
//     }
// })
//限定用户输入的字符为2-8
// extend('equals_twoeight', {
//     validate: (value) => {
//         if (value.length < 2 || value.length > 8) {
//             return false
//         }
//         return true
//     },
//     message: (field) => field + `长度在2-8个字符之间`

// })
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
    message: '生效时间不能和失效时间相同||失效时间不能小于生效时间'
})
// 不能为-1
extend('no_One', {
    validate: (value) => {
        if (value == -1) {
            return false
        }
        return true
    },
    message: (field) => {
        return `${field}不能是未指定执行方`
    }
})
extend('checkTime', {
    params: ['target'],
    validate: (value, { target }) => {
        // console.log('退房：',value, '入住：', target);
        return Date.parse(value) > Date.parse(target)
    },
    message: '入住时间应早于退房时间'
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

//专用于可搜索的下拉框的插件
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
// 可以为空的校验使得表单有样式
Vue.directive('nulllabel', {
    componentUpdated: (el, binding) => {
        const clz = binding.value.errors[0]
            ? 'is-valid'
            : binding.value.validated
                ? 'is-valid'
                : ''
        $(el).removeClass('is-valid').removeClass('is-valid').addClass(clz)
    },
})
Vue.component('vo', ValidationObserver)
Vue.component('vp', ValidationProvider)
// Vue.use(VeeValidate)
export const Pattern = {
    IP: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/,
    MAC: /(([a-f]|[A-F]|\d){2}:){5}([a-f]|[A-F]|\d){2}/
}