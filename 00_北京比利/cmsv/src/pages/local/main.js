import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Home from "./Home.vue";

Vue.use(ElementUI);

Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

new Vue({
  render: h => h(Home)
}).$mount("#app");
