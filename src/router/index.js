import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/ket-qua',
    name: 'Result',
    component: () =>
      import(/* webpackChunkName: "result" */ '../views/Result.vue')
  },
  {
    path: '/dieu-khien/:location',
    name: 'Control',
    component: () =>
      import(/* webpackChunkName: "control" */ '../views/Control.vue')
  },

  {
    path: '/dang-ky/:location',
    name: 'register',
    component: () =>
      import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/quay-so/:location/:id',
    name: 'lotte',
    component: () =>
      import(/* webpackChunkName: "lotte" */ '../views/Lotte.vue')
  },
  {
    path: '/list/:location',
    name: 'list',
    component: () => import(/* webpackChunkName: "list" */ '../views/List.vue')
  },
  {
    path: '/unused/:location',
    name: 'unused',
    component: () =>
      import(/* webpackChunkName: "unused" */ '../views/Unused.vue')
  },
  {
    path: '*',
    name: 'notfound',
    component: () =>
      import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
