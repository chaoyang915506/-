import Vue from "vue";
// import ElementUI from "element-ui";
import "@/plugins/element-ui/index";
import App from "./App.vue";

import i18n from '@/i18n'
// Vue.config.productionTip = process.env.NODE_ENV === "production";
// Vue.config.devtools = process.env.NODE_ENV !== "production";
Vue.config.devtools = true;

// Vue.use(ElementUI);

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
