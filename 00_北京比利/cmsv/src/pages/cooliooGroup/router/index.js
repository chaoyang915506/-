import Vue from "vue";
import VueRouter from "vue-router";

import Home from '../Home.vue'


Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "",
  routes: [
    {
      path: '/src/pages/cooliooGroup/',
      component: Home
    },
    {
      path: '/src/pages/cooliooGroup/index.html',
      component: Home
    },
    {
      path: '/cmsv/cooliooGroup/index.html',
      component: Home
    }
  ]
});

export default router;
