import Vue from 'vue'
import Vuex from 'vuex'
import App from './RoleApp.vue'
import '@/plugins/bootstrap'
import "@/plugins/theme";
import swal from '@/plugins/sweetalert'
import '@/validation'
import elementUI from "element-ui";
import ele_zh from "element-ui/lib/locale/lang/zh-CN";
import ele_en from "element-ui/lib/locale/lang/en";
import i18n from "@/i18n";
import Env from "@/env";

let locale = ele_zh;
if (Env.locale === "1") {
  locale = ele_en;
}

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);
Vue.use(swal);
Vue.use(elementUI, { locale });

const store = new Vuex.Store({
    state: {
        roles: [],
        // hotels: [],
        // hotelGroups: [],
    },
    mutations: {
        setRoles: (state, payload) => state.roles = payload,
        // setHotels: (state, payload) => (state.hotels = payload),
        // setHotelGroups: (state, payload) => (state.hotelGroups = payload),
        jumpTo: (state, payload) => state.href = payload,
    }
});

new Vue({
    store,
    i18n,
    render: h => h(App),
}).$mount('#app');
