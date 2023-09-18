import Vue from 'vue';
import Vuex from 'vuex';
import swalvue from '@/plugins/sweetalert/swalvue'
import '@/plugins/bootstrap'
import App from './SyscnfApp.vue'
import { SyscnfGroupApi, SyscnfApi, SyscnfMetaApi } from '@/api/SyscnfApi'
import Api from '@/api/Api';

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.use(Vuex)
Vue.use(swalvue)

const store = new Vuex.Store({
    state: {
        groups: [],
        curGroupId: 0,
        metas: [],
        sys: [],
    },
    mutations: {
        setGroups: (state, payload) => state.groups = payload,
        setCurGroupId: (state, payload) => state.curGroupId = payload,
        setMetas: (state, payload) => state.metas = payload,
        setSys: (state, payload) => state.sys = payload,
    }
});

const vm = new Vue({
    store,
    render: h => h(App),
    created() {
        SyscnfGroupApi.list()
                .then(data => this.$store.commit('setGroups', data.list))
                .catch(err => common.error(err))
    }
})

Api.all([SyscnfMetaApi.list(), SyscnfApi.list()], (data, data1) => {
    store.state.metas = data.list
    store.state.sys = data1.list
    vm.$mount('#app')
})
