import Vue from "vue";
import Router from "vue-router";
import login from "@/components/login";
import selectRoom from "@/components/selectRoom";
import room from "@/components/room";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/selectRoom",
      name: "selectRoom",
      component: selectRoom,
    },
    {
      path: "/room",
      name: "room",
      component: room,
    },
  ],
  // linkActiveClass: 'mui-active'
});
