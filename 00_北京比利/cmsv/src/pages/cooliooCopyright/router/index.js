import Vue from "vue";
import VueRouter from "vue-router";

// import Home from "../Home.vue";
import App from "../App.vue";
import Add from "../Add.vue";
import Edit from "../Edit.vue";

Vue.use(VueRouter);

const envpath = process.env.VITE ? `/src/pages` : `/cmsv`;

const router = new VueRouter({
  mode: "history",
  base: "",
  routes: [
    {
      path: envpath + "/cooliooCopyright/index.html",
      component: App,
    },
    {
      path: envpath + "/cooliooCopyright/add.html",
      component: Add,
    },
    {
      path: envpath + "/cooliooCopyright/edit.html",
      component: Edit,
    },
  ],
});

export default router;
