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

const ReportPage = defineAsyncComponent(() => import("pages/ReportPage.vue"));

const OsEdit = defineAsyncComponent(() =>
  import("components/utils/CardEditOs.vue")
);

const OsCard = defineAsyncComponent(() =>
  import("components/utils/CardOs.vue")
);

const routes = [
  {
    path: "/login",
    name: "login",
    component: StoreUserPage,
    //component: () => import("layouts/LoginLayout.vue"),
    // children: [
    // { path: "/", component: () => import("pages/StoreUserPage.vue") },
    //],
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "create-os",
        component: StoreOsPage,
      },
      {
        path: "os-history",
        name: "os-history",
        component: ServiceHistoryPage,
      },
      {
        path: "os-history/:id",
        name: "os-card",
        component: OsCard,
      },
      {
        path: "os-edit/:id",
        name: "os-edit",
        component: OsEdit,
      },
      { path: "home", component: UpdateUserPage },
      {
        path: "report",
        component: ReportPage,
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
