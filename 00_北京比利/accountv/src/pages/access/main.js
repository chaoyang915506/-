import Vue from 'vue'
import Vuex from 'vuex'
import App from './Access.vue';
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import '@/validation'
import moment from "moment";

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);
Vue.use(swal);

const store = new Vuex.Store({
    state: {
        audits: [],
    },
    mutations: {
        setAudits: (state, payload) => state.audits = payload,
    }
});

Vue.filter('dateFormat', function (tick) {
    return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');