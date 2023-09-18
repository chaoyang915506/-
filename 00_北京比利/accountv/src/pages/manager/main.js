import Vue from 'vue'
import Vuex from 'vuex'
import App from './ManagerApp.vue'
import '@/plugins/bootstrap'
import swal from '@/plugins/sweetalert'
import '@/validation'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex);
Vue.use(swal);

const store = new Vuex.Store({
    state: {
        roles: [],
        hotels: [],
        hotelGroups: [],
    },
    mutations: {
        setRoles: (state, payload) => state.roles = payload,
        setHotels: (state, payload) => state.hotels = payload,
        setHotelGroups: (state, payload) => state.hotelGroups = payload,
    }
});

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
