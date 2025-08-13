import { defineStore } from "pinia";

export const globalActions = defineStore("globalActions", {
  state: () => ({ collapsed: false, toggleDark: false }),
  actions: {
    setCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});
