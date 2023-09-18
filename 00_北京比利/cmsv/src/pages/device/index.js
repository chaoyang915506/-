import Vue from "vue";
import i18n from "@/i18n";
import router from "./router/index.js";
import "@/plugins/bootstrap";
import Home from "./Home.vue";

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

new Vue({
  router,
  i18n,
  render: h => h(Home)
}).$mount("#app");
