import api from "../../config/axios";
import type { Params, Store } from "../interfaces/people/dependent.interfaces";

const prefix = "dependent/";

class dependentServices {
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
}

export default new dependentServices();
