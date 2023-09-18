import Vue from "vue";
import router from './router'
import "@/plugins/bootstrap";
import Home from './Home.vue'
// import Test from './Test.vue'

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

new Vue({
  router,
  render: (h) => h(Home),
}).$mount("#app");
