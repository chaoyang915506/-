import Vue from "vue";
import VueRouter from "vue-router";
import Airlines from "../airlines.vue";
import Add from "../Add";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/cmsv/airlines/index.html",
      component: Airlines,
    },
    {
      path: "/cmsv/airlines/add.html",
      component: Add,
      name: "add",
    },
  ],
});

export default router;
