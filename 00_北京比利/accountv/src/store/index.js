import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: '',
        password: '',
        hotels: [],
        chosenHotel: {
            hotelId: 0,
            hotelName: '请选择酒店'
        },
        href: 'HotelList',
        menus: [],
        menuMessage: "",
        // 用户管理跳转到管理员管理
        managerUrl: origin + '/accountv/newManager.html',
    },
    mutations: {
        setUsername: (s, p) => s.username = p,
        setPassword: (s, p) => s.password = p,
        setHotels: (state, payload) => state.hotels = payload,
        choose: (state, payload) => state.chosenHotel = payload,
        jumpTo: (state, payload) => state.href = payload,
        setMenus: (state, payload) => state.menus = payload,
        setManagerUrl: (state, payload) => state.managerUrl = payload,
        updateMenu: (state, payload) => state.menuMessage = payload,
        // changeTab: (state, payload) => state.activeTab = payload
    },
    actions: {
    },
    modules: {
    }
});