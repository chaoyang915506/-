import Vue from "vue";
import VueRouter from "vue-router";

import Hotel from "../Hotel.vue";
import Add from "../Add.vue";
import Edit from "../Edit.vue";
import Choose from "../Choose.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      component: Hotel
    },
    {
      path: "/cmsv/device/index.html",
      component: Hotel
    },
    {
      path: "/cmsv/device/add.html",
      component: Add
    },
    {
      path: "/cmsv/device/edit.html",
      component: Edit
    },
    {
      path: "/cmsv/device/choose.html",
      component: Choose
    }
  ]
});

export default router;
