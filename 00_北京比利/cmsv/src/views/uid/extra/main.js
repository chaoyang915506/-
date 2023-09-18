import '@/plugins/bootstrap'

import Vue from 'vue'
import Vuex from 'vuex'
import UidExtraApp from './UidExtraApp.vue'
import common from '@/common'
import { UidApi } from '@/api/UidApi'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        extras: [],
        uids: [],
    },
    mutations: {
        setExtras: (state, payload) => state.extras = payload,
        setUids: (state, payload) => state.uids = payload,
    },
});

new Vue({
    store,
    render: h => h(UidExtraApp),
    created() {
        UidApi.list()
            .then(data => this.$store.commit('setUids', data.list))
            .catch(err => common.error(err))
    }
}).$mount('#app')
