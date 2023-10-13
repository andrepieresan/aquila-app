import { route } from "quasar/wrappers";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { LocalStorage } from "quasar";
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
    let data = LocalStorage.getItem("x-api");
    console.log("alou", { data });
    let { token } = await api
      .post("/login", data)
      .then((res) => res?.data)
      .catch((e) => {});
    if (!token) return false;
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

  Router.beforeEach((to, from) => {
    if (!isAuthentic() && /home/gi.test(from.name)) {
      console.log("chegou");
      return false;
    }
  });

  return Router;
});
