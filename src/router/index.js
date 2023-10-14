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
  const isAuthentic = async () => {
    let { token } = LocalStorage.getItem("x-api");
    console.log("alou", { token });
    // jwt.verify(token, process.env.API_KEY);
    // console.log("?:", { exist });
    // if (!exist) return false;
    return true;
  };

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath

    history: createWebHistory(),
  });
  ("__q_strn|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiJGJjcnlwdCR2PTk4JHI9MTAkSWV2czZON0I5N1kwV1BHVDd0Q1U5USQ1eFNLRGZWTi9kQ1RGUGcvcTZzQzMvY3I3a1VWWUw4IiwiaWF0IjoxNjk3MjU1MTgzLCJleHAiOjE2OTcyNTYwODN9.R-pYrObVKoj_Rm9FfdlNtFa7rZuxDrrEEthd_SlzpjQ");
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
        }
      } catch (e) {
        console.log("aa", e.message);
        next("/login");
      }
    }
    next();
    // console.log(await isAuthentic());
  });

  return Router;
});
