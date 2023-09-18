import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../Home.vue";
import Edit from "../Edit.vue";

Vue.use(VueRouter);

const envpath = process.env.VITE ? `/src/pages` : `/cmsv`;

const router = new VueRouter({
  mode: "history",
  base: "",
  routes: [
    {
      path: envpath + "/cooliooConfig/index.html",
      component: Home,
    },
    {
      path: envpath + "/cooliooConfig/edit.html",
      component: Edit,
    },
  ],
});

export default router;
