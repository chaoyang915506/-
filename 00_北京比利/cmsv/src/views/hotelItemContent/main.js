import Vue from 'vue';
import Vuex from 'vuex';
import swalvue from '@/plugins/sweetalert/swalvue'
import '@/plugins/bootstrap'
import HotelItemContentApp from './HotelItemContentApp.vue';

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.use(Vuex)
Vue.use(swalvue)

const store = new Vuex.Store({
    state: {
        langList: [],
    },
    mutations: {
        setLangList: (state, payload) => state.langList = payload,
    },
});

new Vue({
    store,
    render: h => h(HotelItemContentApp),
}).$mount('#app')