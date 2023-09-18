import Vue from "vue";
import VueRouter from "vue-router";

import VideoList from "../VideoList.vue";
import Edit from "../Edit.vue";


Vue.use(VueRouter);

const envpath = process.env.VITE ? `/src/pages` : `/cmsv`;

const router = new VueRouter({
  mode: "history",
  base: "",
  routes: [
    {
      path: "/",
      component: VideoList
    },
    {
      path: envpath + "/cooliooSpecialVideo/index.html",
      component: VideoList
    },
    {
      path: envpath + "/cooliooSpecialVideo/edit.html",
      component: Edit
    },
  ]
});

export default router;
