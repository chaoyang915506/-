import Vue from 'vue'
import Vuex from 'vuex'
import '@/plugins/element-ui/index.js'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import App from './HotelItemParamApp.vue'
import Api from '@/api/Api'
import ItemHotelApi from '@/api/ItemHotelApi'
import ItemHotelParamApi from '@/api/ItemHotelParamApi'
import '@/validation'

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        itemHotelParams: [],
        itemHotelList: [],
    },
    mutations: {
        setItemHotelParams: (state, payload) => state.itemHotelParams = payload,
        setItemHotelList: (state, payload) => state.itemHotelList = payload,
    },
    actions: {
        refreshItemHotelParams: context => {
            return ItemHotelParamApi.list().then(data => context.commit('setItemHotelParams', data.list)).catch(err => console.error(err));

        },
    },
});

new Vue({
    store,
    render: h => h(App),
    created() {
        Api.all([ItemHotelApi.list(), ItemHotelParamApi.list()], (itemHotelData, itemHotelParamData) => {
            this.$store.commit('setItemHotelList', itemHotelData.list);
            this.$store.commit('setItemHotelParams', itemHotelParamData.list);
        });
    },
}).$mount('#app')