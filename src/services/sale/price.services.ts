import api from "../../config/axios";
import type { Params, Store } from "../interfaces/people/doctor.interfaces";

const prefix = "people/visitor/";

class priceServices {
  async get(params: Params) {
    const { data } = await api.get(`${prefix}`, {
      params,
    });
    return data;
  }
  async store(data: Store) {
    const { data: response } = await api.post(`${prefix}store`, data);
    return response;
  }
  async update(id: number, data: Store) {
    const { data: response } = await api.put(`${prefix}update/${id}`, data);
    return response;
  }
  async getPermissions() {
    const { data } = await api.get(`${prefix}permissions`);
    return data;
  }

  async exportToExcel() {
    const { data } = await api.post(`${prefix}export/`, { search: '' }, { responseType: 'blob' });
    return data;
  }
}

export default new priceServices();
