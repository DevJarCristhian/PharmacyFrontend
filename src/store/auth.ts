import { defineStore } from "pinia";
import authServices from "./../services/auth.services";
import navigations from "../router/navigations";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: { name: string; id: number; actions: string[] }[];
}

export interface Routes {
  label: string;
  key: string;
  href: string;
  i: string;
  children?: { label: string; key: string; href: string }[];
}

export const authStores = defineStore("auth", {
  state: () => ({
    user: {} as User,
    routes: [] as Routes[],
  }),
  actions: {
    async getUser() {
      const data = await authServices.getUser();
      // console.log("here", data);
      this.user = data as User;
      let permissions = await this.user.permissions;

      const filteredRoutes = await navigations.filter((route) => {
        if (route.children) {
          route.children = route.children.filter((child) =>
            permissions.some((permission) => permission.name === child.key)
          );
          return (
            route.children.length > 0 ||
            permissions.some((permission) => permission.name === route.key)
          );
        }
        return permissions.some((permission) => permission.name === route.key);
      });
      // console.log("filteredRoutes", filteredRoutes);
      this.routes = filteredRoutes as Routes[];
    },
  },
});
