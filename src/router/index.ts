import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "../pages/Login.vue";
import index from "../pages/index.vue";
import PageNotFound from "../pages/PageNotFound.vue";
import Dashboard from "../pages/Dashboard/index.vue";
import Calendar from "../pages/Calendar/index.vue";
import Users from "../pages/Access/Users.vue";
import Roles from "../pages/Access/Roles.vue";
import Dependent from "../pages/People/Dependent.vue";
import Doctor from "../pages/People/Doctor.vue";
import Visitor from "../pages/People/Visitor.vue";
import Opportunity from "../pages/Sale/Opportunity.vue";
import Product from "../pages/Sale/Product.vue";
import Price from "../pages/Sale/Price.vue";
import Chain from "../pages/Data/Chain.vue";
import Institution from "../pages/Data/Institution.vue";
import Pharmacy from "../pages/Data/Pharmacy.vue";
import Patient from "../pages/People/Patient.vue";
import Setting from "../pages/Setting/index.vue";
import Whatsapp from "../pages/Whatsapp/Whatsapp.vue";
import Templates from "../pages/Whatsapp/Templates.vue";
import Access from "../pages/Access/Connetion.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: index,
    redirect: "/dashboard",
    children: [
      { name: "dashboard", path: "/dashboard", component: Dashboard },
      { name: "calendar", path: "/calendar", component: Calendar },
      { name: "whatsapp", path: "/whatsapp", component: Whatsapp },
      { name: "templates", path: "/templates", component: Templates },
      { name: "access", path: "/access", component: Access },
      { name: "users", path: "/users", component: Users },
      { name: "roles", path: "/roles", component: Roles },
      { name: "visitors", path: "/visitors", component: Visitor },
      { name: "doctors", path: "/doctors", component: Doctor },
      { name: "patients", path: "/patients", component: Patient },
      { name: "dependents", path: "/dependents", component: Dependent },
      { name: "opportunities", path: "/opportunities", component: Opportunity },
      { name: "products", path: "/products", component: Product },
      { name: "prices", path: "/prices", component: Price },
      { name: "institutions", path: "/institutions", component: Institution },
      { name: "chains", path: "/chains", component: Chain },
      { name: "pharmacies", path: "/pharmacies", component: Pharmacy },
      { name: "settings", path: "/settings", component: Setting },
    ],
  },
  { path: "/:catchAll(.*)", component: PageNotFound },
];

const mainRouter = createRouter({
  history: createWebHistory(),
  routes,
});

export default mainRouter;
