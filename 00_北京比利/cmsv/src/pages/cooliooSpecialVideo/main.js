import Vue from "vue";
import router from "./router/index.js";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "@/plugins/element-ui/index";
import App from "./App.vue";

import i18n from "@/i18n";
// import locale from "element-ui/lib/locale/lang/en";

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

// console.log(locale);
// Vue.use(ElementUI, {locale});
// Vue.use(ElementUI);

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
