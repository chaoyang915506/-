import Vue from 'vue'
import Vuex from 'vuex'
import App from './LaundryApp.vue'
import '@/plugins/bootstrap'
import swalvue from '@/plugins/sweetalert/swalvue'
import { LaundryClassApi } from '@/api/LaundryApi'

Vue.config.productionTip = process.env.NODE_ENV === 'production'
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)
Vue.use(swalvue)

const store = new Vuex.Store({
    state: {
        classes: [],
    },
    mutations: {
        setClasses: (state, payload) => state.classes = payload,
    },
    actions: {
        initClasses: (context, payload) => {
            LaundryClassApi.list().then(data => {
                context.commit('setClasses', data.list);
            }).catch(err => this.$error(err));
        }
    }
});

new Vue({
    store,
    render: h => h(App),
    created() {
        this.$store.dispatch('initClasses')
    }
}).$mount('#app')
