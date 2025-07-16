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
      console.log(st[0], et[0]);
      // console.log(startDate, endDate);

      // params.categories = this.selectedCalendars.length === this.availableCalendars.length ? [] : this.selectedCalendars
      // params.startDate = DateTime.fromISO(startDate).toFormat("yyyy-LL-dd HH:mm")
      // params.endDate = DateTime.fromISO(endDate).toFormat("yyyy-LL-dd HH:mm")
      const { data } = await calendarServices.get();
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
      console.log(data);
      this.notify = data;
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
