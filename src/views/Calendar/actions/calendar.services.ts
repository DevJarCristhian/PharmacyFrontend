import api from "../../../config/axios";
// import type { Params, Store } from "./calendar.interfaces";
import type { Store } from "./calendar.interfaces";

const prefix = "calendar/";

class calendarServices {
  async get(params: { startDate: string, endDate: string }) {
    const { data } = await api.get(`${prefix}`, { params });
    return data;
  }
  async store(data: Store) {
    const { data: response } = await api.post(`${prefix}`, data);
    return response;
  }
  async update(id: number, data: Store) {
    const { data: response } = await api.put(`${prefix}${id}`, data);
    return response;
  }

  async getPatientCalendarId(id: number) {
    const { data: response } = await api.get(`${prefix}${id}`);
    return response;
  }

  async getNotifications() {
    const data = await api.get(`${prefix}calendar/notifications`);
    return data;
  }

  async getActiveWhatsapp() {
    const data = await api.get(`connection/active`);
    return data;
  }
}

export default new calendarServices();
