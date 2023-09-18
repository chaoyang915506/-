import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";


Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

// Vue.use(ElementUI, {locale});
Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount("#app");