import Vue from "vue";
import router from "./router/index.js";
// import ElementUI from "element-ui";
import "@/plugins/element-ui/index";
import App from "./App.vue";

import i18n from "@/i18n";
// import locale from "element-ui/lib/locale/lang/en";

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

// Vue.use(ElementUI, {locale});

new Vue({
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
