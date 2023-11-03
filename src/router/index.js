import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/Auth";
import routes from "./routes";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath

    history: createWebHistory(),
  });
  Router.beforeEach(async (to, from, next) => {
    if (!/login/gi.test(to.name)) {
      try {
        let storageToken = localStorage.getItem("x-api");
        if (storageToken) {
          let valid = await useAuthStore().checkToken;

          if (!valid) {
            next("/login");
          }
          next();
          return;
        }
      } catch (e) {
        next("/login");
        return;
      }
    }
    next();
    // console.log(await isAuthentic());
  });

  return Router;
});
