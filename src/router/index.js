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
    path: '/dieu-khien',
    name: 'Control',
    component: () =>
      import(/* webpackChunkName: "control" */ '../views/Control.vue')
  },
  {
    path: '/ha-noi',
    name: 'hanoi-nav',
    component: () =>
      import(/* webpackChunkName: "hanoi nav" */ '../views/Hanoi.vue')
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
    path: '/da-nang',
    name: 'danang-nav',
    component: () =>
      import(/* webpackChunkName: "danang nav" */ '../views/Danang.vue')
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
