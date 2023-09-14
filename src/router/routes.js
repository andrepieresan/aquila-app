import { defineAsyncComponent } from "vue";

const routes = [
  {
    path: "",
    component: defineAsyncComponent(() => import("pages/StoreUserPage.vue")),
    //component: () => import("layouts/LoginLayout.vue"),
    // children: [
    // { path: "/", component: () => import("pages/StoreUserPage.vue") },
    //],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "create-os",
        component: defineAsyncComponent(() => import("pages/StoreOsPage.vue")),
      },
      {
        path: "os-history",
        component: defineAsyncComponent(() =>
          import("pages/ServiceHistoryPage.vue")
        ),
      },
      { path: "user", component: () => import("pages/UpdateUserPage.vue") },
      {
        path: "stock",
        component: defineAsyncComponent(() => import("pages/StockPage.vue")),
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
