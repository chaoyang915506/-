import Vue from "vue";
import Vuex from "vuex";
import swal from "@/plugins/sweetalert";
import App from "./AccessApp.vue";
import "@/plugins/theme";

import elementUI from "element-ui";
import ele_zh from "element-ui/lib/locale/lang/zh-CN";
import ele_en from "element-ui/lib/locale/lang/en";
import i18n from "@/i18n";
import moment from "moment";

import Env from "@/env";
let locale = ele_zh;
if (Env.locale === "1") {
  locale = ele_en;
}

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

Vue.use(Vuex);
Vue.use(swal);
Vue.use(elementUI, { locale });

const store = new Vuex.Store({
  state: {
    audits: [],
  },
  mutations: {
    setAudits: (state, payload) => (state.audits = payload),
  },
});

Vue.filter("dateFormat", function(tick) {
  return moment(tick).format("YYYY-MM-DD HH:mm:ss");
});

new Vue({
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
