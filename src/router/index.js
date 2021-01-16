import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/ha-noi",
    name: "Hanoi",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Hanoi.vue")
  },
  {
    path: "/da-nang",
    name: "Dânng",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Danang.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
