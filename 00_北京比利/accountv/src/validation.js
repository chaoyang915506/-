import { extend, localize, ValidationObserver, ValidationProvider } from "vee-validate";
import zh_CN from 'vee-validate/dist/locale/zh_CN.json';
import * as rules from "vee-validate/dist/rules";
import Vue from 'vue';

localize('zh_CN', zh_CN);

for (let k in rules) {
    extend(k, rules[k]);
}

extend('equals_to', {
    params: ['target'],
    validate: (value, { target }) => {
        return value === target;
    },
    message: '两次输入密码不相同'
});

Vue.directive('validate', {
    componentUpdated: (el, binding) => {
        const clz = binding.value.errors[0]
            ? 'is-invalid'
            : binding.value.validated
                ? 'is-valid'
                : '';
        $(el).removeClass('is-invalid').removeClass('is-valid').addClass(clz);
    },
});

Vue.component('vo', ValidationObserver);
Vue.component('vp', ValidationProvider);
