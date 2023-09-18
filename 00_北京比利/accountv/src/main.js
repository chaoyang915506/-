import "@/plugins/bootstrap";
import swal from "@/plugins/sweetalert";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./validation";
import i18n from "./i18n";

import '@/icons/iconfont.css'
import '@/plugins/theme'
import elementUI from 'element-ui';
Vue.use(elementUI);
Vue.config.productionTip = process.env.NODE_ENV === "production";
Vue.config.devtools = process.env.NODE_ENV !== "production";

Vue.use(swal);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

Vue.directive("cool-focus", {
  inserted: (el) => el.focus(),
});

addEventListener("message", (ev) => {
  if (ev.origin !== origin) {
    return;
  }
  switch (ev.data.type) {
    case "manager":
      const managerURL = new URL(store.state.managerUrl);
      // console.log(store.state.managerUrl, '123');
      managerURL.searchParams.set("roleId", ev.data.roleId);
      // console.log(managerURL, '123');
      store.commit("jumpTo", managerURL.toString());
      break;
    case "menu":
      const menuData = ev.data.menuMsg
      store.commit("updateMenu", menuData);
      break;
  }
});
