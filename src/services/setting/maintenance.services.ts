import api from "../../config/axios";
import type {
  Params,
  Store,
  StoreCategory,
} from "../interfaces/setting/maintenance.interfaces";

const prefix = "setting/maintenance/";

class maintenanceServices {
  async get() {
    const { data } = await api.get(`${prefix}parent`);
    return data;
  }
  async store(data: StoreCategory) {
    const { data: response } = await api.post(`${prefix}parent`, data);
    return response;
  }
  async update(id: number, data: StoreCategory) {
    const { data: response } = await api.put(`${prefix}parent/${id}`, data);
    return response;
  }

  async getChild(params: Params) {
    const { data } = await api.get(`${prefix}child`, {
      params,
    });
    return data;
  }
  async storeChild(data: Store) {
    const { data: response } = await api.post(`${prefix}child`, data);
    return response;
  }
  async updateChild(id: number, data: Store) {
    const { data: response } = await api.put(`${prefix}child/${id}`, data);
    return response;
  }
}

export default new maintenanceServices();
