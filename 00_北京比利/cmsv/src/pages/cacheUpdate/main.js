import Vue from "vue";
import Home from "./Home.vue";

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

new Vue({
  render: (h) => h(Home),
}).$mount("#app");
