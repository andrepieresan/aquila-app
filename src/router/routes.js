const MainLayout = () => import("layouts/MainLayout.vue");
const StoreUserPage = () => import("pages/StoreUserPage.vue");
const StoreOsPage = () => import("pages/StoreOsPage.vue");
const UpdateUserPage = () => import("pages/UpdateUserPage.vue");
const ServiceHistoryPage = () => import("pages/ServiceHistoryPage.vue");
const ReportPage = () => import("pages/ReportPage.vue");
const OsEdit = () => import("components/utils/os_history/CardEditOs.vue");
const OsCard = () => import("components/utils/os_history/CardOs.vue");
const MaterialPage = () => import("pages/MaterialPage.vue");

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
      {
        path: "home",
        component: UpdateUserPage,
      },
      {
        path: "report",
        component: ReportPage,
      },
      {
        path: "material",
        component: MaterialPage,
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
