import Vue from "vue";
import router from "./router/index.js";
// import ElementUI from "element-ui";
// import "@/theme/index.css";
import "@/plugins/element-ui/index";
import i18n from "@/i18n";

import Home from "./Home.vue";

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";
// Vue.use(ElementUI);

new Vue({
  router,
  i18n,
  render: (h) => h(Home),
}).$mount("#app");
