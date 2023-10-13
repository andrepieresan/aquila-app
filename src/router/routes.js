import { defineAsyncComponent } from "vue";

const MainLayout = defineAsyncComponent(() => import("layouts/MainLayout.vue"));
const StoreUserPage = defineAsyncComponent(() =>
  import("pages/StoreUserPage.vue")
);
const StoreOsPage = defineAsyncComponent(() => import("pages/StoreOsPage.vue"));
const UpdateUserPage = defineAsyncComponent(() =>
  import("pages/UpdateUserPage.vue")
);
const ServiceHistoryPage = defineAsyncComponent(() =>
  import("pages/ServiceHistoryPage.vue")
);
const StockPage = defineAsyncComponent(() => import("pages/StockPage.vue"));

const routes = [
  {
    path: "",
    name: "login",
    component: StoreUserPage,
    //component: () => import("layouts/LoginLayout.vue"),
    // children: [
    // { path: "/", component: () => import("pages/StoreUserPage.vue") },
    //],
  },
  {
    path: "/",
    name: "home",
    component: MainLayout,
    children: [
      {
        path: "create-os",
        component: StoreOsPage,
      },
      {
        path: "os-history",
        component: ServiceHistoryPage,
      },
      { path: "home", component: UpdateUserPage },
      {
        path: "stock",
        component: StockPage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  /**{
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },*/
];

export default routes;
