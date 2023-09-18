import '@/plugins/bootstrap'

import Vue from 'vue'
import Vuex from 'vuex'
import UidApp from './UidApp.vue'
import ItemBasicApi from '@/api/ItemBasicApi'
import common from '@/common'

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        uids: [],
        itemBasics: [],
    },
    mutations: {
        setItemBasics: (state, payload) => state.itemBasics = payload,
        setUids: (state, payload) => state.uids = payload,
    },
});

new Vue({
    store,
    render: h => h(UidApp),
    created() {
        ItemBasicApi.list()
            .then(data => this.$store.commit('setItemBasics', data.list))
            .catch(err => common.error(err))
    }
}).$mount('#app')
