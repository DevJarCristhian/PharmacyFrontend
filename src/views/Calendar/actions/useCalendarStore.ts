import calendarServices from "./calendar.services";
// import { authStores } from '@/stores/auth.stores';
import { defineStore } from "pinia";
import type { Event } from "./types";

// let params = {
//     user: null,
//     startDate: "",
//     endDate: "",
//     categories: []
// };

interface iNotify {
  id: number;
  title: string;
  message: string;
  status: string;
  user: string;
  createdAt: string;
}

// const useAuthStores = authStores();

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    availableCalendars: [
      {
        label: "Recordatorio",
        color: "#ffd22f",
      },
      {
        label: "Programación",
        color: "#8ec5fe",
      },
    ],
    selectedCalendars: <any>[],
    listEvents: <Event[]>[],
    notify: <iNotify[]>[],
    activeWhatsapp: 'Desconectado',
  }),
  actions: {
    async fetchCategories() {
      this.selectedCalendars.map((item: any) => {
        this.selectedCalendars.push(item.id);
      });
    },
    async fetchEvents(startDate: string, endDate: string) {
      let st = startDate.split("T");
      let et = endDate.split("T");

      const params = {
        startDate: st[0],
        endDate: et[0],
      };

      const { data } = await calendarServices.get(params);
      // console.log(data);

      this.listEvents = data;

      return data;
    },
    async removeEvent() {
      // eventId: number
      // const response = await calendarServices.delete(eventId);
      return [];
    },
    async fetchNotifications() {
      const { data } = await calendarServices.getNotifications();
      // console.log(data);
      this.notify = data;
    },
    async fetchActiveWhastapp() {
      const { data } = await calendarServices.getActiveWhatsapp();
      // console.log(data);
      this.activeWhatsapp = data;
    },
  },
  getters: {
    async getNotifications(): Promise<iNotify[]> {
      const store = this as unknown as ReturnType<typeof useCalendarStore>;
      if (store.notify.length === 0) {
        await store.fetchNotifications();
      }
      return store.notify;
    },
  },
});
